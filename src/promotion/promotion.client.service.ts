import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleType } from './enums';

@Injectable()
export class PromotionClientService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(player: Player) {
    const result = await this.prisma.promotion.findMany({
      where: {
        vips: {
          some: {
            id: player.vip_id,
          },
        },
        OR: [
          {
            start_at: {
              lte: new Date(),
            },
            end_at: {
              gte: new Date(),
            },
          },
          { schedule_type: ScheduleType.FOREVER },
        ],
        is_active: true,
      },
    });

    return this.prisma.success(result);
  }
}
