import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateGamesDto } from './dto/create-games.dto';
import { SearchGameDto } from './dto/search-game.dto';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateGameDto) {
    return this.prisma.game.create({
      data,
    });
  }
  createMany(batchData: CreateGamesDto) {
    const { platform_code, games } = batchData;
    return this.prisma.game.createMany({
      data: games.map((g) => ({ ...g, platform_code })),
      skipDuplicates: true,
    });
  }

  async fetchAll(search: SearchGameDto) {
    const { platform_code } = search;
    return this.prisma.listFormat({
      items: await this.prisma.game.findMany({
        where: {
          platform_code,
        },
      }),
      count: await this.prisma.game.count({
        where: {
          platform_code,
        },
      }),
    });
  }
}
