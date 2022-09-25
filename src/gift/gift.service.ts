import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchGiftsDto } from './dto/search-gifts.dto';

@Injectable()
export class GiftService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll(search: SearchGiftsDto) {
    const { promotion_id, username, nickname, vip_ids } = search;
    return this.prisma.gift.findMany({
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
    });
  }
}
