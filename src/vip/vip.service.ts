import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVipDto } from './dto/create-vip.dto';
import { SearchVipQueueDto } from './dto/search-vip-queue.dto';
import { SearchVipWaterDto } from './dto/search-vip-water.dto';
import { SetGameWaterDto } from './dto/set-game-water.dto';
import { UpdateVipDto } from './dto/update-vip.dto';
import { vipCheck, VipCheckItem } from './raw/vipCheck';
import { vipList } from './raw/vipList';

@Injectable()
export class VipService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('vip')
    private readonly vipQueue: Queue<string>,
  ) {}
  create(data: CreateVipDto) {
    return this.prisma.vip.create({
      data,
    });
  }

  async findAll() {
    const records = await this.prisma.$queryRaw(vipList());
    return this.prisma.success(records);
  }

  async options() {
    const result = await this.prisma.vip.findMany({
      select: { id: true, name: true },
    });
    return this.prisma.success(result);
  }

  async findOne(id: string) {
    const result = await this.prisma.vip.findUnique({ where: { id } });
    return this.prisma.success(result);
  }

  async update(id: string, data: UpdateVipDto) {
    await this.prisma.vip.update({
      where: { id },
      data,
    });
    return this.prisma.success();
  }

  async getWaters(search: SearchVipWaterDto) {
    const { id, platform_code } = search;
    const result = await this.prisma.gameWater.findMany({
      where: {
        vip_id: id,
        platform_code,
      },
    });
    return this.prisma.success(result);
  }

  async setWaters(data: SetGameWaterDto) {
    const { setting, id } = data;
    await Promise.all(
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
              vip_id: id,
            },
          },
          create: {
            vip_id: id,
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
    return this.prisma.success();
  }

  async remove(id: string) {
    await this.prisma.vip.delete({ where: { id } });
    return this.prisma.success();
  }

  async conditionCheck(start: Date, end: Date) {
    const result = await this.prisma.$queryRaw(vipCheck(start, end));

    return this.prisma.success(result);
  }

  async checkAndApply(start: Date, end: Date) {
    const result = await this.prisma.$queryRaw<VipCheckItem[]>(
      vipCheck(start, end),
    );

    try {
      await Promise.all(
        result.map(async (t) => {
          return await this.prisma.player.update({
            where: {
              id: t.id,
            },
            data: {
              vip_id: t.next_vip?.id,
            },
          });
        }),
      );
    } catch (err) {
      this.prisma.error(ResCode.EXCEPTION_ERR, JSON.stringify(err));
    }

    return this.prisma.success(result);
  }
  async getVipQueue(data: SearchVipQueueDto) {
    const { statuses } = data;
    const jobs = await this.vipQueue.getJobs(statuses);

    return this.prisma.success(jobs);
  }
}
