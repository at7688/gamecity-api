import { Prisma } from '@prisma/client';
import { SearchPlayerRollingDto } from './dto/search-player-rolling.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchGiftsDto } from './dto/search-gifts.dto';
import {
  RollingOverview,
  giftRollingOverview,
} from './raw/giftRollingOverview';
import { ResCode } from 'src/errors/enums';
import { GiftStatus, GiftType } from './enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { WalletRecType } from 'src/wallet-rec/enums';

@Injectable()
export class GiftService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  async statistics(search: SearchGiftsDto) {
    const {
      promotion_id,
      username,
      nickname,
      vip_ids,
      apply_approval_type,
      pay_approval_type,
      settlement_type,
    } = search;

    return {
      promotions: await this.prisma.promotion.findMany({
        where: {
          id: promotion_id,
          apply_approval_type,
          pay_approval_type,
          settlement_type,
          gifts: {
            some: {
              player: {
                username: {
                  contains: username,
                },
                nickname: {
                  contains: nickname,
                },
                vip_id: {
                  in: vip_ids,
                },
              },
            },
          },
        },
        include: {
          game_water: true,
          recharge_reward: true,
        },
      }),
      meta: await this.prisma.gift.groupBy({
        by: ['promotion_id', 'status'],
        where: {
          promotion: {
            id: promotion_id,
            apply_approval_type,
            pay_approval_type,
            settlement_type,
          },
          player: {
            username: {
              contains: username,
            },
            nickname: {
              contains: nickname,
            },
            vip_id: {
              in: vip_ids,
            },
          },
        },
        _count: true,
      }),
    };
  }

  async overview(search: SearchPlayerRollingDto) {
    const {
      username,
      nickname,
      recieve_start_at,
      recieve_end_at,
      page,
      perpage,
    } = search;

    const findManyArg: Prisma.PlayerFindManyArgs = {
      select: {
        id: true,
        nickname: true,
        username: true,
      },
      where: {
        username,
        nickname,
        gifts: {
          some: {
            recieved_at: {
              gte: recieve_start_at,
              lte: recieve_end_at,
            },
          },
        },
      },
      take: perpage,
      skip: (page - 1) * perpage,
    };

    const players = await this.prisma.player.findMany(findManyArg);
    const count = await this.prisma.player.count({ where: findManyArg.where });
    if (!players.length) {
      this.prisma.error(ResCode.NOT_FOUND, '查無資料');
    }
    const items = await this.prisma.$queryRaw<RollingOverview[]>(
      giftRollingOverview(players.map((t) => t.id)),
    );
    return this.prisma.listFormat({
      items,
      count,
    });
  }

  async findAll(search: SearchGiftsDto) {
    const { promotion_id, username, nickname, vip_ids } = search;
    const findManyArg: Prisma.GiftFindManyArgs = {
      where: {
        promotion_id,
        player: {
          username: {
            contains: username,
          },
          nickname: {
            contains: nickname,
          },
          vip_id: {
            in: vip_ids,
          },
        },
      },
      include: {
        promotion: true,
      },
    };
    return this.prisma.listFormat({
      items: await this.prisma.gift.findMany(findManyArg),
      count: await this.prisma.gift.count({ where: findManyArg.where }),
    });
  }

  async abandon(gift_id: string) {
    const gift = await this.prisma.gift.findUnique({
      where: { id: gift_id },
      include: { promotion: true, sender: true },
    });
    if (!gift) {
      this.prisma.error(ResCode.NOT_FOUND, '查無紀錄');
    }
    if (gift.type === GiftType.PROMOTION) {
      await this.prisma.$transaction([
        this.prisma.gift.update({
          where: {
            id: gift.id,
          },
          data: {
            status: GiftStatus.ABANDONED,
          },
        }),
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.GIFT_ROLLBACK,
          player_id: gift.player_id,
          amount: -gift.amount,
          rolling_amount: -gift.rolling_amount,
          source: gift.promotion.title,
          relative_id: gift.id,
        })),
      ]);
    } else if (gift.type === GiftType.AGENT_SEND) {
      await this.prisma.$transaction([
        this.prisma.gift.update({
          where: {
            id: gift.id,
          },
          data: {
            status: GiftStatus.ABANDONED,
          },
        }),
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.GIFT_ROLLBACK,
          player_id: gift.player_id,
          amount: -gift.amount,
          rolling_amount: -gift.rolling_amount,
          source: gift.sender.username,
          relative_id: gift.id,
        })),
        ...(await this.walletRecService.agentCreate({
          type: WalletRecType.GIFT_ROLLBACK,
          agent_id: gift.sender_id,
          amount: gift.amount,
          source: gift.sender.username,
          relative_id: gift.id,
        })),
      ]);
    }
  }
}
