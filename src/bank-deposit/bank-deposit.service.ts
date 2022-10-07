import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { ResCode } from 'src/errors/enums';
import { PlayerTagType } from 'src/player/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepositPayload } from 'src/socket/types';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { SearchBankDepositsDto } from './dto/search-bank-deposits.dto';
import { UpdateBankDepositDto } from './dto/update-bank-deposit.dto';
import { BankDepositStatus } from './enums';

@Injectable()
export class BankDepositService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(search: SearchBankDepositsDto) {
    const {
      nickname,
      username,
      account,
      name,
      created_start_at,
      created_end_at,
      amount_from,
      amount_to,
      status,
    } = search;

    const findManyArgs: Prisma.BankDepositRecFindManyArgs = {
      where: {
        status,
        player: {
          nickname: {
            contains: nickname,
          },
          username: {
            contains: username,
          },
        },
        player_card: {
          account: {
            contains: account,
          },
          name: {
            contains: name,
          },
        },
        created_at: {
          gte: created_start_at,
          lte: created_end_at,
        },
        amount: {
          gte: amount_from,
          lte: amount_to,
        },
      },
      include: {
        player: {
          select: {
            id: true,
            nickname: true,
            username: true,
          },
        },
        player_card: {
          select: {
            id: true,
            bank_code: true,
            branch: true,
            name: true,
            account: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    };
    return this.prisma.listFormat({
      items: await this.prisma.bankDepositRec.findMany(findManyArgs),
      count: await this.prisma.bankDepositRec.count({
        where: findManyArgs.where,
      }),
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} bankDeposit`;
  }

  async update(id: string, data: UpdateBankDepositDto) {
    const { inner_note, outter_note, status } = data;
    const record = await this.prisma.bankDepositRec.findUnique({
      where: { id },
      include: {
        card: true,
        player_card: true,
        player: { include: { vip: true, agent: true } },
      },
    });

    if (!record) {
      this.prisma.error(ResCode.NOT_FOUND, '查無紀錄');
    }

    if (record.status > 2) {
      this.prisma.error(ResCode.DUPICATED_OPERATION, '不可重複審核');
    }

    if (status === BankDepositStatus.FINISHED) {
      // 查看是否有儲值紀錄
      const rechargedTag = await this.prisma.playerTag.findFirst({
        where: { player_id: record.player.id, type: PlayerTagType.RECHARGED },
      });

      if (!rechargedTag) {
        // 無儲值紀錄則將玩家打上儲值紀錄
        await this.prisma.playerTag.create({
          data: {
            player_id: record.player.id,
            type: PlayerTagType.RECHARGED,
          },
        });
      }

      const finished_at = new Date();

      await this.prisma.$transaction([
        this.prisma.bankDepositRec.update({
          where: { id },
          data: {
            inner_note,
            outter_note,
            status,
            finished_at,
            is_first: !rechargedTag, // 無儲值紀錄則此單為首儲
          },
        }),
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.BANK_DEPOSIT,
          player_id: record.player_id,
          amount: record.amount,
          fee: 0,
          source: `(${record.card.bank_code})${record.card.account}`,
          relative_id: record.id,
        })),
      ]);

      const notify: DepositPayload = {
        type: 'bank',
        status: 'finish',
        id: record.id,
        username: record.player.username,
        nickname: record.player.nickname,
        created_at: record.created_at,
        finished_at,
        amount: record.amount,
        vip_name: record.player.vip.name,
        // count: record.times,
        agent_nickname: record.player.agent.nickname,
        agent_username: record.player.agent.username,
      };

      this.eventEmitter.emit('deposit.finish.bank', notify);
    } else {
      await this.prisma.bankDepositRec.update({
        where: { id },
        data: { inner_note, outter_note, status },
      });
    }

    return this.prisma.success();
  }
}
