import { Injectable } from '@nestjs/common';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionStatus, PromotionType, ScheduleType } from './enums';

@Injectable()
export class PromotionService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreatePromotionDto) {
    const {
      type,
      title,
      start_at,
      end_at,
      is_active,
      apply_approval_type,
      pay_approval_type,
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
    } = data;
    if (schedule_type !== ScheduleType.FOREVER && end_at < new Date()) {
      this.prisma.error(ResCode.FIELD_NOT_VALID, '結束時間不可小於當前時間');
    }
    return this.prisma.promotion.create({
      data: {
        type,
        title,
        start_at,
        end_at,
        is_active,
        apply_approval_type,
        pay_approval_type,
        schedule_type,
        valid_bet,
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
        status:
          schedule_type !== ScheduleType.FOREVER && start_at > new Date()
            ? PromotionStatus.COMMING
            : PromotionStatus.RUNING,
      },
      include: {
        recharge_reward: true,
        game_water: true,
      },
    });
  }

  async findAll() {
    const result = await this.prisma.promotion.findMany({
      include: { recharge_reward: true },
    });
    return this.prisma.success(result);
  }

  findOne(id: string) {
    return `This action returns a #${id} promotion`;
  }

  update(id: string, data: UpdatePromotionDto) {
    const {
      type,
      title,
      start_at,
      end_at,
      is_active,
      apply_approval_type,
      pay_approval_type,
      schedule_type,
      settlement_type,
      vip_ids,
      game_water,
      nums_rolling,
      reward_max,
      applicants_max,
      apply_times,
      recharge_reward,
      valid_bet,
    } = data;
    return this.prisma.promotion.update({
      where: {
        id,
      },
      data: {
        type,
        title,
        start_at,
        end_at,
        is_active,
        apply_approval_type,
        pay_approval_type,
        schedule_type,
        settlement_type,
        valid_bet,
        vips: {
          connect: vip_ids.map((id) => ({ id })),
        },
        game_water:
          type === PromotionType.WATER
            ? {
                updateMany: game_water.map((t) => ({
                  where: {
                    promotion_id: id,
                  },
                  data: {
                    platform_code: t.platform_code,
                    game_code: t.game_code,
                    water: t.water,
                  },
                })),
              }
            : undefined,
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
  }

  remove(id: string) {
    return `This action removes a #${id} promotion`;
  }
}
