import { Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import { subDays, subMonths } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletRecClientService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(player: Player) {
    const findManyArg: Prisma.WalletRecFindManyArgs = {
      where: {
        player_id: player.id,
        created_at: {
          gte: subMonths(new Date(), 2),
        }, // 僅可搜尋兩個月內
      },
      orderBy: {
        created_at: 'desc',
      },
    };
    return this.prisma.listFormat({
      items: await this.prisma.walletRec.findMany(findManyArg),
      count: await this.prisma.walletRec.count({ where: findManyArg.where }),
    });
  }
}
