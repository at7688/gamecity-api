import { SendStatus } from './../gift/enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PaymentDepositStatus } from 'src/payment-deposit/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApprovalType, PromotionType } from 'src/promotion/enums';
import { ApplicantStatus } from './enums';

@Injectable()
export class ApplicantService {
  constructor(private readonly prisma: PrismaService) {}

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
    if (promotion.start_at > new Date()) {
      throw new BadRequestException('活動尚未開始');
    }
    if (promotion.end_at < new Date()) {
      throw new BadRequestException('活動已結束');
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

    // 生成申請單(未審核)
    const applicant = await this.prisma.applicant.create({
      data: {
        promotion_id,
        player_id: player.id,
      },
    });

    // 判斷是否為自動審核, 審核通過則直接生成待發禮包
    if (promotion.apply_approval_type === ApprovalType.AUTO) {
      const isValid = await this.autoVerify(promotion_id, applicant.id);
      if (isValid) {
        // 通過驗證則生成禮包
        // 判斷是否自動派發禮包
        await this.prisma.$transaction([
          this.prisma.applicant.update({
            where: { id: applicant.id },
            data: {
              status: ApplicantStatus.APPROVED,
            },
          }),
          this.prisma.gift.create({
            data: {
              promotion_id,
              player_id: applicant.player_id,
              status:
                promotion.pay_approval_type === ApprovalType.AUTO
                  ? SendStatus.SENT
                  : SendStatus.UNPROCESSED,
            },
          }),
        ]);
      } else {
        // 未通過
        await this.prisma.applicant.update({
          where: { id: applicant.id },
          data: {
            status: ApplicantStatus.REJECTED,
          },
        });
      }
    }
    return { success: true };
  }
  async autoVerify(promotion_id: string, applicant_id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotion_id },
    });
    const applicant = await this.prisma.applicant.findUnique({
      where: { id: applicant_id },
    });
    if (promotion.type === PromotionType.FIRST_RECHARGE) {
      let isValid = false;
      // 查詢在活動時間區間內 該玩家是否已有符合首儲的紀錄
      const record = await this.prisma.paymentDepositRec.findFirst({
        where: {
          player_id: applicant.player_id,
          created_at: {
            gte: promotion.start_at,
            lte: new Date(),
          },
          status: PaymentDepositStatus.PAID,
          is_first: true,
          promotion_id: null,
        },
      });

      isValid = !!record;

      // 將該儲值紀錄綁定活動ID (下次報名不可使用此紀錄)
      await this.prisma.paymentDepositRec.update({
        where: {
          id: record.id,
        },
        data: {
          promotion_id,
        },
      });

      return isValid;
    } else if (promotion.type === PromotionType.NORMAL_RECHARGE) {
      let isValid = false;
      const record = await this.prisma.paymentDepositRec.findFirst({
        where: {
          player_id: applicant.player_id,
          created_at: {
            gte: promotion.start_at,
            lte: new Date(),
          },
          status: PaymentDepositStatus.PAID,
          promotion_id: null,
        },
      });
      isValid = !!record;

      // 將該儲值紀錄綁定活動ID (下次報名不可使用此紀錄)
      await this.prisma.paymentDepositRec.update({
        where: {
          id: record.id,
        },
        data: {
          promotion_id,
        },
      });

      return isValid;
    } else if (promotion.type === PromotionType.WATER) {
      // 代定
      return true;
    }
  }
}
