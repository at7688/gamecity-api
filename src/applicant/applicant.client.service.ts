import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Applicant, Player, Prisma } from '@prisma/client';
import { Queue } from 'bull';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ApprovalType,
  ScheduleType,
  SettlementType,
} from 'src/promotion/enums';
import { PromotionApplyPayload } from 'src/socket/types';
import { ApplicantService } from './applicant.service';
import { ApplicantStatus } from './enums';

@Injectable()
export class ApplicantClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly applicantService: ApplicantService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue('applicant')
    private readonly applicantQueue: Queue<Applicant>,
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
      this.prisma.error(ResCode.NOT_FOUND, '無此活動');
    }

    // 驗證是否於活動時間內申請
    if (promotion.schedule_type !== ScheduleType.FOREVER) {
      if (promotion.start_at > new Date()) {
        this.prisma.error(ResCode.PROMOTION_NOT_RUNNING, '活動尚未開始');
      }
      if (promotion.end_at < new Date()) {
        this.prisma.error(ResCode.PROMOTION_NOT_RUNNING, '活動已結束');
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
        this.prisma.error(ResCode.OVER_APPLICANT_LIMIT, '已達申請人數上限');
      }
    }

    // 驗證是否符合可申請的VIP等級
    if (!promotion.vips.some((t) => t.id === player.vip_id)) {
      this.prisma.error(ResCode.VIP_LEVEL_NOT_ALLOW, '玩家等級資格不符');
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
        this.prisma.error(ResCode.OVER_APPLY_TIMES, '已達個人申請次數上限');
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
      this.prisma.error(ResCode.ALREADY_APPLIED, '已申請待審核');
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
      this.prisma.error(ResCode.APPLICANT_REJECTED, '申請未通過');
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
      promotion.approval_type !== ApprovalType.MANUAL &&
      promotion.settlement_type === SettlementType.IMMEDIATELY
    ) {
      console.log('there');
      // await this.applicantService.autoVerify(
      //   applicant.promotion_id,
      //   applicant.id,
      // );
      await this.applicantQueue.add('verify', applicant);
    }
    this.eventEmitter.emit('promotion.apply', {
      promotion: promotion.title,
      username: player.username,
    } as PromotionApplyPayload);
    return this.prisma.success();
  }

  async findAll(player: Player) {
    const findManyArg: Prisma.ApplicantFindManyArgs = {
      where: {
        player_id: player.id,
      },
      include: {
        promotion: {
          select: {
            id: true,
            title: true,
          },
        },
        gift: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    };
    return this.prisma.listFormat({
      items: await this.prisma.applicant.findMany(findManyArg),
      count: await this.prisma.applicant.count({ where: findManyArg.where }),
    });
  }
}
