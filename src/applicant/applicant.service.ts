import { Injectable } from '@nestjs/common';
import { sumBy } from 'lodash';
import { BetRecordStatus } from 'src/bet-record/enums';
import { GiftService } from 'src/gift/gift.service';
import { PaymentDepositStatus } from 'src/payment-deposit/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApprovalType, PromotionType, RollingType } from 'src/promotion/enums';
import { GiftStatus } from './../gift/enums';
import { SearchApplicantsDto } from './dto/search-applicants.dto';
import { ApplicantStatus } from './enums';

@Injectable()
export class ApplicantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly giftService: GiftService,
  ) {}

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
      let rollingAmount = rewardAmount * promotion.nums_rolling;

      if (rolling_type === RollingType.INCLUDE_RECHARGE) {
        rollingAmount = (rewardAmount + record.amount) * promotion.nums_rolling;
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
                ? GiftStatus.SENT
                : GiftStatus.UNPROCESSED,
            send_at:
              promotion.pay_approval_type === ApprovalType.AUTO
                ? new Date()
                : null,
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
          player_id: applicant.player_id,
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
      const rollingAmount = rewardAmount * promotion.nums_rolling;

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
                ? GiftStatus.SENT
                : GiftStatus.UNPROCESSED,
            send_at:
              promotion.pay_approval_type === ApprovalType.AUTO
                ? new Date()
                : null,
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
