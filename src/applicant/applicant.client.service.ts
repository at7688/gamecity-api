import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ApprovalType,
  ScheduleType,
  SettlementType,
} from 'src/promotion/enums';
import { ApplicantService } from './applicant.service';
import { ApplicantStatus } from './enums';

@Injectable()
export class ApplicantClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applicantService: ApplicantService,
  ) {}

  async create(promotion_id: string, player: Player) {
    const promotion = await this.prisma.promotion.findFirst({
      where: {
        id: promotion_id,
        is_active: true,
        // vips: {
        //   some: { id: player.vip_id },
        // },
      },
      include: { vips: true },
    });
    // 驗證是否有該活動(或活動未開啟)
    if (!promotion) {
      throw new BadRequestException('無此活動');
    }

    // 驗證是否於活動時間內申請
    if (promotion.schedule_type !== ScheduleType.FOREVER) {
      if (promotion.start_at > new Date()) {
        throw new BadRequestException('活動尚未開始');
      }
      if (promotion.end_at < new Date()) {
        throw new BadRequestException('活動已結束');
      }
    }

    // 驗證申請人數是否已達上限
    if (promotion.applicants_max !== 0) {
      const applicantCount = await this.prisma.applicant.count({
        where: {
          promotion_id,
          status: {
            not: ApplicantStatus.REJECTED,
          },
        },
      });
      if (applicantCount >= promotion.applicants_max) {
        throw new BadRequestException('已達申請人數上限');
      }
    }

    // 驗證是否符合可申請的VIP等級
    if (!promotion.vips.some((t) => t.id === player.vip_id)) {
      throw new BadRequestException('玩家等級資格不符');
    }

    // 驗證是否達到個人申請上限
    if (promotion.apply_times !== 0) {
      const applicantCount = await this.prisma.applicant.count({
        where: {
          promotion_id,
          player_id: player.id,
          status: {
            not: ApplicantStatus.REJECTED,
          },
        },
      });
      if (applicantCount >= promotion.apply_times) {
        throw new BadRequestException('已達個人申請次數上限');
      }
    }

    // 確認是否此活動已有該玩家未審核的申請單
    const applyingCount = await this.prisma.applicant.count({
      where: {
        promotion_id,
        player_id: player.id,
        status: ApplicantStatus.APPLIED,
      },
    });
    if (applyingCount) {
      throw new BadRequestException('已申請待審核');
    }

    // 確認是否此活動已有該玩家已拒絕的申請單
    const rejectedCount = await this.prisma.applicant.count({
      where: {
        promotion_id,
        player_id: player.id,
        status: ApplicantStatus.REJECTED,
      },
    });
    if (rejectedCount) {
      throw new BadRequestException('申請未通過');
    }

    // 生成申請單(未審核)
    const applicant = await this.prisma.applicant.create({
      data: {
        promotion_id,
        player_id: player.id,
      },
    });

    // 判斷是否為立即結算且自動審核, 審核通過則直接生成待發禮包
    if (
      promotion.apply_approval_type === ApprovalType.AUTO &&
      promotion.settlement_type === SettlementType.IMMEDIATELY
    ) {
      await this.applicantService.autoVerify(promotion_id, applicant.id);
    }
    return { success: true };
  }

  async findAll(player: Player) {
    return this.prisma.applicant.findMany({
      where: {
        player_id: player.id,
      },
      include: {
        promotion: true,
        gift: true,
      },
    });
  }
}
