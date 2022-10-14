import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { ProcessStatus } from 'src/enums';
import { ResCode } from 'src/errors/enums';
import { PlayerTagType } from 'src/player/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WithdrawPayload } from 'src/socket/types';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { SearchWithdrawsDto } from './dto/search-withdraws.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';

@Injectable()
export class WithdrawService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  create(createWithdrawDto: CreateWithdrawDto) {
    return 'This action adds a new bankWithdraw';
  }

  async findAll(search: SearchWithdrawsDto) {
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

    const findManyArgs: Prisma.WithdrawRecFindManyArgs = {
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
            vip: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
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
      orderBy: {
        created_at: 'desc',
      },
    };
    return this.prisma.listFormat({
      items: await this.prisma.withdrawRec.findMany(findManyArgs),
      count: await this.prisma.withdrawRec.count({
        where: findManyArgs.where,
      }),
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.withdrawRec.findUnique({
      where: { id },
      include: {
        player: {
          select: {
            id: true,
            nickname: true,
            username: true,
            vip: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
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
    });

    if (!record) {
      this.prisma.error(ResCode.NOT_FOUND, '查無紀錄');
    }

    return this.prisma.success(record);
  }

  async validate(data: UpdateWithdrawDto) {
    const { id, inner_note, outter_note, status, fee } = data;

    const record = await this.prisma.withdrawRec.findUnique({
      where: { id },
      include: {
        player_card: true,
        player: { include: { vip: true, agent: true } },
      },
    });

    if (!record) {
      this.prisma.error(ResCode.NOT_FOUND, '查無紀錄');
    }

    if (record.status >= 10) {
      this.prisma.error(ResCode.DUPICATED_OPERATION, '不可重複審核');
    }

    if (status === ProcessStatus.FINISHED) {
      const finished_at = new Date();
      fee || record.fee;
      this.prisma.$transaction([
        // 紀錄完成日期
        this.prisma.withdrawRec.update({
          where: { id: record.id },
          data: {
            status: ProcessStatus.FINISHED,
            fee,
            inner_note,
            outter_note,
            finished_at,
          },
          include: { player_card: true },
        }),
        // 錢包操作
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.WITHDRAW,
          player_id: record.player_id,
          amount: -record.amount,
          fee, // 已送單時設定的提領手續費為主，無設定則以紀錄為主
          source: `(${record.player_card.bank_code})${record.player_card.account}`,
          relative_id: record.id,
        })),
      ]);

      const notify: WithdrawPayload = {
        id: record.id,
        status: 'finish',
        username: record.player.username,
        nickname: record.player.nickname,
        created_at: record.created_at,
        finished_at,
        amount: record.amount,
        vip_name: record.player.vip.name,
        count: record.times,
        agent_nickname: record.player.agent.nickname,
        agent_username: record.player.agent.username,
      };

      // for TG通知
      this.eventEmitter.emit('withdraw.finish', notify);

      // 更新會員的出金次數
      await this.prisma.playerTag.upsert({
        where: {
          player_id_type: {
            player_id: record.player_id,
            type: PlayerTagType.WITHDRAWED,
          },
        },
        create: {
          player_id: record.player_id,
          type: PlayerTagType.WITHDRAWED,
          count: record.times,
        },
        update: {
          count: record.times,
        },
      });
    } else {
      await this.prisma.withdrawRec.update({
        where: { id },
        data: { inner_note, outter_note, status, finished_at: new Date() },
      });
    }
    return this.prisma.success();
  }
}
