import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { app } from 'src/utils/ms';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  fetchAll() {
    // return this.prisma.game.findMany();
    return app.GameList();
  }
}
