import { UpdateGamePlatformDto } from './dto/update-game-platform.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchGamePlatformsDto } from './dto/search-game-platforms.dto';
import { MaintenanceStatus } from 'src/maintenance/enums';

@Injectable()
export class GamePlatformService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search: SearchGamePlatformsDto) {
    const {} = search;
    return this.prisma.gamePlatform.findMany({
      include: {
        maintenance: {
          where: {
            is_repeat: true,
            repeat_end_at: { gt: new Date() },
            status: { not: MaintenanceStatus.DONE },
          },
        },
      },
    });
  }

  async update(code: string, data: UpdateGamePlatformDto) {
    const { status } = data;
    await this.prisma.gamePlatform.update({
      where: { code },
      data: {
        status,
      },
    });

    return this.prisma.success();
  }
}
