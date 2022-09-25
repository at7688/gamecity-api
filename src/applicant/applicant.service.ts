import { SendStatus } from './../gift/enums';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PaymentDepositStatus } from 'src/payment-deposit/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ApprovalType,
  PromotionType,
  RollingType,
  ScheduleType,
  SettlementType,
} from 'src/promotion/enums';
import { ApplicantStatus } from './enums';
import { GiftService } from 'src/gift/gift.service';
import { BetRecordStatus } from 'src/bet-record/enums';
import { sumBy } from 'lodash';
import { SearchApplicantsDto } from './dto/search-applicants.dto';

@Injectable()
export class ApplicantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly giftService: GiftService,
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
      await this.autoVerify(promotion_id, applicant.id);
    }
    return { success: true };
  }
  async autoVerify(promotion_id: string, applicant_id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotion_id },
      include: { recharge_reward: true, game_water: true },
    });

    const applicant = await this.prisma.applicant.findUnique({
      where: { id: applicant_id },
    });

    // 儲值類活動驗證
    if (
      [PromotionType.FIRST_RECHARGE, PromotionType.NORMAL_RECHARGE].includes(
        promotion.type,
      )
    ) {
      const { recharge_amount } = promotion.recharge_reward;

      // 查詢在活動時間區間內 該玩家是否已有符合首儲/續儲的紀錄
      const record = await this.prisma.paymentDepositRec.findFirst({
        where: {
          player_id: applicant.player_id,
          created_at: {
            gte: promotion.start_at ? promotion.start_at : undefined,
            lte: new Date(),
          },
          status: PaymentDepositStatus.PAID,
          amount: {
            gte: recharge_amount,
          },
          is_first: promotion.type === PromotionType.FIRST_RECHARGE,
          promotion_id: null,
        },
      });

      if (!record) {
        await this.prisma.applicant.update({
          where: { id: applicant.id },
          data: {
            status: ApplicantStatus.REJECTED,
            note: '未有符合條件的儲值單',
          },
        });
        return;
      }

      const { reward_amount, reward_percent, reward_type, rolling_type } =
        promotion.recharge_reward;

      // 禮包金額計算
      let rewardAmount = reward_amount || 0;

      rewardAmount += (record.amount * reward_percent) / 100;

      // 若禮包金額計算結果超過上限，則以上限數值為主
      if (rewardAmount >= promotion.reward_max) {
        rewardAmount = promotion.reward_max;
      }

      // 流水金額計算
      let rollingAmount = rewardAmount * promotion.rolling_demand;

      if (rolling_type === RollingType.INCLUDE_RECHARGE) {
        rollingAmount =
          (rewardAmount + record.amount) * promotion.rolling_demand;
      }

      await this.prisma.$transaction([
        // 將該儲值紀錄綁定活動ID (下次報名不可使用此紀錄)
        this.prisma.paymentDepositRec.update({
          where: {
            id: record.id,
          },
          data: {
            promotion_id,
          },
        }),
        // 更新申請單狀態為「核准」
        this.prisma.applicant.update({
          where: { id: applicant.id },
          data: {
            status: ApplicantStatus.APPROVED,
          },
        }),
        // 生成禮包(手動/自動派發)
        this.prisma.gift.create({
          data: {
            promotion_id,
            applicant_id,
            player_id: applicant.player_id,
            amount: rewardAmount,
            rolling_amount: rollingAmount,
            status:
              promotion.pay_approval_type === ApprovalType.AUTO
                ? SendStatus.SENT
                : SendStatus.UNPROCESSED,
          },
        }),
      ]);
    } else if (promotion.type === PromotionType.WATER) {
      // 搜尋出活動時間內符合該反水條件的遊戲注單
      const records = await this.prisma.betRecord.findMany({
        where: {
          platform_code: {
            in: promotion.game_water.map((t) => t.platform_code),
          },
          game_code: {
            in: promotion.game_water.map((t) => t.game_code),
          },
          status: BetRecordStatus.DONE,
          promotion_id: null,
          bet_at: {
            gte: promotion.start_at, // TODO: 依照scheduleType判斷開始計算的時間點
            lte: new Date(),
          },
        },
      });
      // 驗證有效金額是否到達反水標準
      if (sumBy(records, (t) => t.valid_amount) <= promotion.valid_bet) {
        await this.prisma.applicant.update({
          where: { id: applicant.id },
          data: {
            status: ApplicantStatus.REJECTED,
            note: '有效投注未達標準',
          },
        });
        return;
      }

      // 禮包金額計算
      const gameWaterMap = promotion.game_water.reduce<Record<string, number>>(
        (obj, next) => {
          obj[`${next.platform_code}|${next.game_code}`] = next.water;
          return obj;
        },
        {},
      );
      const rewardAmount = +sumBy(
        records,
        (t) =>
          (t.valid_amount * gameWaterMap[`${t.platform_code}|${t.game_code}`]) /
          100,
      ).toFixed(0);

      // 流水金額計算
      const rollingAmount = rewardAmount * promotion.rolling_demand;

      // 將注單加上以參與活動標註, 修改申請單狀態, 生成禮包
      await this.prisma.$transaction([
        this.prisma.betRecord.updateMany({
          where: {
            id: {
              in: records.map((t) => t.id),
            },
          },
          data: {
            promotion_id,
          },
        }),
        this.prisma.applicant.update({
          where: {
            id: applicant_id,
          },
          data: {
            status: ApplicantStatus.APPROVED,
          },
        }),
        this.prisma.gift.create({
          data: {
            promotion_id,
            applicant_id,
            player_id: applicant.player_id,
            amount: rewardAmount,
            rolling_amount: rollingAmount,
            status:
              promotion.pay_approval_type === ApprovalType.AUTO
                ? SendStatus.SENT
                : SendStatus.UNPROCESSED,
          },
        }),
      ]);
    }
  }

  async findAll(search: SearchApplicantsDto) {
    const {
      promotion_id,
      promotion_name,
      username,
      nickname,
      vip_ids,
      apply_approval_type,
      settlement_type,
      types,
      approval_statuses,
      promotion_statuses,
      apply_start_at,
      apply_end_at,
    } = search;

    return this.prisma.applicant.findMany({
      where: {
        status: {
          in: approval_statuses,
        },
        promotion: {
          id: promotion_id,
          title: { contains: promotion_name },
          apply_approval_type,
          settlement_type,
          type: { in: types },
          status: { in: promotion_statuses },
        },
        player: {
          username: { contains: username },
          nickname: { contains: nickname },
          vip_id: { in: vip_ids },
        },
        created_at: {
          gte: apply_start_at,
          lte: apply_end_at,
        },
      },
    });
  }
}
