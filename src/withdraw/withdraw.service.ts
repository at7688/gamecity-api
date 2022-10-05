import { SearchWithdrawsDto } from './dto/search-withdraws.dto';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Prisma } from '@prisma/client';
import { WithdrawStatus } from './enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { PlayerTagType } from 'src/player/enums';

@Injectable()
export class WithdrawService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
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

  findOne(id: string) {
    return this.prisma.withdrawRec.findUnique({
      where: { id },
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
    });
  }

  async update(id: string, data: UpdateWithdrawDto) {
    const { inner_note, outter_note, status, withdraw_fee } = data;

    const record = await this.prisma.withdrawRec.findUnique({
      where: { id },
      include: { player_card: true },
    });

    // 若設定狀態為撥款完成，則累計進會員提領次數
    if (record.finished_at === null && status === WithdrawStatus.FINISHED) {
      this.prisma.$transaction([
        // 紀錄完成日期
        this.prisma.withdrawRec.update({
          where: { id: record.id },
          data: {
            finished_at: new Date(),
          },
          include: { player_card: true },
        }),
        // 錢包操作
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.WITHDRAW,
          player_id: record.player_id,
          amount: -record.amount,
          fee: record.withdraw_fee,
          source: `(${record.player_card.bank_code})${record.player_card.account}`,
          relative_id: record.id,
        })),
      ]);

      // 會員的出金次數加1
      const withdrawTag = await this.prisma.playerTag.findUnique({
        where: {
          player_id_type: {
            player_id: record.player_id,
            type: PlayerTagType.WITHDRAWED,
          },
        },
      });

      if (!withdrawTag) {
        await this.prisma.playerTag.create({
          data: {
            player_id: record.player_id,
            type: PlayerTagType.WITHDRAWED,
          },
        });
      } else {
        this.prisma.playerTag.update({
          where: {
            player_id_type: {
              player_id: record.player_id,
              type: PlayerTagType.WITHDRAWED,
            },
          },
          data: {
            count: {
              increment: 1,
            },
          },
        });
      }
    } else {
      const record = await this.prisma.withdrawRec.update({
        where: { id },
        data: { inner_note, outter_note, status, withdraw_fee },
        include: { player_card: true },
      });
    }
    return this.prisma.success();
  }
}
