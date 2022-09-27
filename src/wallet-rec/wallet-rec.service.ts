import { Injectable } from '@nestjs/common';
import { AdminUser, Member, Prisma } from '@prisma/client';
import * as numeral from 'numeral';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { CreateWalletRecDto } from './dto/create-wallet-rec.dto';
import { ManualOperationDto } from './dto/manual-operation.dto';
import { SearchWalletRecDto } from './dto/search-wallet-rec.dto';
import { WalletTargetType } from './enums';

@Injectable()
export class WalletRecService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search: SearchWalletRecDto, agent?: Member) {
    const {
      target_types,
      types,
      username,
      nickname,
      amount_start,
      amount_end,
      start_at,
      end_at,
      page,
      perpage,
    } = search;

    const findManyArgs: Prisma.WalletRecFindManyArgs = {
      where: {
        agent_id: agent?.id,
        type: {
          in: types,
        },
        target: {
          in: target_types,
        },
        OR: [
          {
            player: {
              username: { contains: username },
              nickname: { contains: nickname },
            },
          },
          {
            agent: {
              username: { contains: username },
              nickname: { contains: nickname },
            },
          },
        ],
        amount: {
          gte: amount_start,
          lte: amount_end,
        },
        created_at: {
          gte: start_at,
          lte: end_at,
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
        agent: {
          select: {
            id: true,
            nickname: true,
            username: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: perpage,
      skip: (page - 1) * perpage,
    };
    return this.prisma.listFormat({
      items: await this.prisma.walletRec.findMany(findManyArgs),
      count: await this.prisma.walletRec.count({ where: findManyArgs.where }),
    });
  }

  async manualOperation(data: ManualOperationDto, user: AdminUser) {
    const { target_type, amount, note, username } = data;
    if (!amount) {
      this.prisma.error(ResCode.EMPTY_VAL, '數值不可為空');
    }
    try {
      if (target_type === WalletTargetType.AGENT) {
        const agent = await this.prisma.member.findUnique({
          where: {
            username,
          },
        });
        if (!agent) {
          this.prisma.error(ResCode.NOT_FOUND, '無此代理');
        }

        await this.prisma.$transaction(
          await this.agentCreate({
            type:
              amount > 0 ? WalletRecType.MANUAL_ADD : WalletRecType.MANUAL_SUB,
            agent_id: agent.id,
            amount,
            source: user.username,
            operator_id: user.id,
            note,
          }),
        );
      } else {
        const player = await this.prisma.player.findUnique({
          where: {
            username,
          },
        });
        if (!player) {
          this.prisma.error(ResCode.NOT_FOUND, '無此會員');
        }
        await this.prisma.$transaction(
          await this.playerCreate({
            type:
              amount > 0 ? WalletRecType.MANUAL_ADD : WalletRecType.MANUAL_SUB,
            player_id: player.id,
            amount,
            source: user.username,
            operator_id: user.id,
            note,
          }),
        );
      }
    } catch (err) {
      throw err;
    }

    return this.prisma.success();
  }

  async playerCreate(data: CreateWalletRecDto) {
    const {
      type,
      player_id,
      rolling_amount,
      amount,
      source,
      fee = 0,
      operator_id,
      note,
      relative_id,
    } = data;
    const player = await this.prisma.player.findUnique({
      where: { id: player_id },
    });
    const result_balance = numeral(player.balance).add(amount).value();
    if (result_balance < 0) {
      this.prisma.error(ResCode.BALANCE_NOT_ENOUGH, '餘額不足');
    }
    return [
      this.prisma.walletRec.create({
        data: {
          type,
          target: WalletTargetType.PLAYER,
          player_id,
          amount,
          origin_balance: player.balance,
          result_balance,
          source,
          fee,
          operator_id,
          note,
          relative_id,
          rolling_amount,
        },
      }),
      this.prisma.player.update({
        where: { id: player_id },
        data: {
          balance: {
            set: numeral(player.balance).add(amount).subtract(fee).value(),
          },
        },
      }),
    ];
  }
  async agentCreate(data: CreateWalletRecDto) {
    const {
      type,
      agent_id,
      amount,
      source,
      fee = 0,
      operator_id,
      note,
      relative_id,
    } = data;
    const agent = await this.prisma.member.findUnique({
      where: { id: agent_id },
    });
    const result_balance = numeral(agent.balance).add(amount).value();
    if (result_balance < 0) {
      this.prisma.error(ResCode.BALANCE_NOT_ENOUGH, '餘額不足');
    }
    return [
      this.prisma.walletRec.create({
        data: {
          type,
          target: WalletTargetType.AGENT,
          agent_id,
          amount,
          origin_balance: agent.balance,
          result_balance,
          source,
          fee,
          operator_id,
          note,
          relative_id,
        },
      }),
      this.prisma.member.update({
        where: { id: agent_id },
        data: {
          balance: {
            set: numeral(agent.balance).add(amount).subtract(fee).value(),
          },
        },
      }),
    ];
  }
}
