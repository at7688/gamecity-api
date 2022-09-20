import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVipDto } from './dto/create-vip.dto';
import { SetGameWaterDto } from './dto/set-game-water.dto';
import { UpdateVipDto } from './dto/update-vip.dto';
import { vipList } from './raw/vipList';

@Injectable()
export class VipService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateVipDto) {
    return this.prisma.vip.create({
      data,
    });
  }

  async findAll() {
    const records = await this.prisma.$queryRaw(vipList());
    return this.prisma.listFormat(records[0]);
  }

  async options() {
    return this.prisma.vip.findMany({
      select: { id: true, name: true },
    });
  }

  findOne(id: string) {
    return this.prisma.vip.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateVipDto) {
    return this.prisma.vip.update({
      where: { id },
      data,
    });
  }

  gameWater(data: SetGameWaterDto) {
    const { setting, vip_id } = data;
    return Promise.all(
      setting.map((t) => {
        return this.prisma.gameWater.upsert({
          select: {
            platform_code: true,
            game_code: true,
            water: true,
          },
          where: {
            platform_code_game_code_vip_id: {
              platform_code: t.platform_code,
              game_code: t.game_code,
              vip_id,
            },
          },
          create: {
            vip_id,
            platform_code: t.platform_code,
            game_code: t.game_code,
            water: t.water,
          },
          update: {
            water: t.water,
          },
        });
      }),
    );
  }

  remove(id: string) {
    return this.prisma.vip.delete({ where: { id } });
  }
}
