import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateGameDto) {
    return this.prisma.game.create({
      data,
    });
  }
  createMany(data: CreateGameDto[]) {
    return this.prisma.game.createMany({
      data,
      skipDuplicates: true,
    });
  }

  fetchAll() {
    return this.prisma.game.findMany();
  }
}
