import { UpdateGamePlatformDto } from './dto/update-game-platform.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchGamePlatformsDto } from './dto/search-game-platforms.dto';

@Injectable()
export class GamePlatformService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search: SearchGamePlatformsDto) {
    const {} = search;
    return this.prisma.gamePlatform.findMany();
  }

  async update(code: string, data: UpdateGamePlatformDto) {
    const { status } = data;
    await this.prisma.gamePlatform.update({
      where: { code },
      data: {
        status,
      },
    });

    return { success: true };
  }
}
