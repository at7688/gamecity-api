import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Promotion } from '@prisma/client';
import { Queue } from 'bull';
import { addSeconds } from 'date-fns';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { SearchPromotionWaterDto } from './dto/search-promotion-water.dto';
import { SetGameWaterDto } from './dto/set-game-water.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import {
  ApprovalType,
  PromotionType,
  ScheduleType,
  SettlementType,
} from './enums';

@Injectable()
export class PromotionService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('promotion')
    private readonly promotionQueue: Queue<Promotion>,
  ) {}
  async create(data: CreatePromotionDto) {
    const {
      type,
      title,
      start_at,
      end_at,
      is_active,
      approval_type,
      schedule_type,
      vip_ids,
      game_water,
      nums_rolling,
      reward_max,
      applicants_max,
      settlement_type,
      apply_times,
      recharge_reward,
      valid_bet,
      apply_gap,
    } = data;
    if (end_at < new Date()) {
      this.prisma.error(ResCode.FIELD_NOT_VALID, '結束時間不可小於當前時間');
    }
    const record = await this.prisma.promotion.create({
      data: {
        type,
        title,
        start_at,
        end_at,
        is_active,
        approval_type,
        schedule_type,
        valid_bet,
        apply_gap,
        vips: {
          connect: vip_ids.map((id) => ({ id })),
        },
        game_water:
          type === PromotionType.WATER
            ? {
                createMany: {
                  data: game_water.map((t) => ({
                    platform_code: t.platform_code,
                    game_code: t.game_code,
                    water: t.water,
                  })),
                },
              }
            : undefined,
        recharge_reward: {
          create: recharge_reward,
        },
        nums_rolling,
        reward_max,
        applicants_max,
        settlement_type,
        apply_times,
      },
      include: {
        recharge_reward: true,
        game_water: true,
      },
    });

    if (
      record.approval_type !== ApprovalType.MANUAL &&
      record.settlement_type === SettlementType.ENDING
    ) {
      // 推到自動審核排程
      await this.promotionQueue.add('settlement', record, {
        repeat: {
          cron: '* * * * * *',
          startDate: addSeconds(record.end_at, 10),
          limit: 1,
        },
      });
    }
    return this.prisma.success();
  }

  async findAll() {
    const result = await this.prisma.promotion.findMany({
      include: {
        recharge_reward: true,
        vips: { select: { id: true, name: true } },
      },
    });
    return this.prisma.success(result);
  }

  async findOne(id: string) {
    const result = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        recharge_reward: true,
        game_water: true,
        vips: { select: { id: true, name: true, icon: true } },
      },
    });
    return this.prisma.success(result);
  }

  async getWaters(search: SearchPromotionWaterDto) {
    const { id, platform_code } = search;
    const result = await this.prisma.gameWater.findMany({
      where: {
        promotion_id: id,
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
            platform_code_game_code_promotion_id: {
              platform_code: t.platform_code,
              game_code: t.game_code,
              promotion_id: id,
            },
          },
          create: {
            promotion_id: id,
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

  async update(id: string, data: UpdatePromotionDto) {
    const {
      type,
      title,
      start_at,
      end_at,
      is_active,
      vip_ids,
      nums_rolling,
      reward_max,
      applicants_max,
      apply_times,
      recharge_reward,
      valid_bet,
    } = data;
    await this.prisma.promotion.update({
      where: {
        id,
      },
      data: {
        type,
        title,
        start_at,
        end_at,
        is_active,
        valid_bet,
        vips: {
          connect: vip_ids.map((id) => ({ id })),
        },
        recharge_reward: {
          update: recharge_reward,
        },
        nums_rolling,
        reward_max,
        applicants_max,
        apply_times,
      },
      include: {
        game_water: true,
        recharge_reward: true,
      },
    });

    return this.prisma.success();
  }

  async remove(id: string) {
    const jobs = await this.promotionQueue.getJobs(['delayed']);
    jobs.forEach((t) => {
      if (t.data.id === id) {
        t.remove();
      }
    });
    await this.prisma.promotion.delete({ where: { id } });
    return this.prisma.success();
  }

  async getQueue() {
    const jobs = await this.promotionQueue.getJobs(['delayed']);
    return this.prisma.success(jobs);
  }
}
