import { Injectable } from '@nestjs/common';
import { MaintenanceStatus, MaintenanceType } from 'src/maintenance/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateGamePlatformDto } from './dto/update-game-platform.dto';

@Injectable()
export class GamePlatformService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const result = await this.prisma.gamePlatform.findMany({
      include: {
        maintenance: {
          where: {
            is_repeat: true,
            type: MaintenanceType.GAME_PLATFORM,
            repeat_end_at: { gt: new Date() },
            status: { not: MaintenanceStatus.DONE },
          },
        },
      },
    });
    return this.prisma.success(result);
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
