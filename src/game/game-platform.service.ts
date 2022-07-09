import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GamePlatformService {
  constructor(private readonly prisma: PrismaService) {}

  fetchAll() {
    return this.prisma.gamePlatform.findMany({
      include: {
        category: true,
        games: true,
      },
    });
  }
}
