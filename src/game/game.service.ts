import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateGamesDto } from './dto/create-games.dto';

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

  fetchAll() {
    return this.prisma.game.findMany();
  }
}
