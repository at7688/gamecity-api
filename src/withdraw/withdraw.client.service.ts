import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from '@prisma/client';
import { Request } from 'express';
import { ProcessStatus, ValidateStatus } from 'src/enums';
import { ResCode } from 'src/errors/enums';
import { PlayerTagType } from 'src/player/enums';
import { PlayerRolling, playerRolling } from 'src/player/raw/playerRolling';
import { PrismaService } from 'src/prisma/prisma.service';
import { WithdrawPayload } from 'src/socket/types';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { SearchWithdrawsDto } from './dto/search-withdraws.dto';

@Injectable({ scope: Scope.REQUEST })
export class WithdrawClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(REQUEST) private request: Request,
  ) {}

  get player() {
    return this.request.user as Player;
  }

  async create(data: CreateWithdrawDto) {
    const { amount, player_card_id } = data;

    const player = await this.prisma.player.findUnique({
      where: { id: this.player.id },
    });

    // 驗證餘額是否足夠
    if (amount > player.balance) {
      this.prisma.error(ResCode.BALANCE_NOT_ENOUGH, '餘額不足');
    }
    // 驗證是否達到流水標準
    const result = await this.prisma.$queryRaw<PlayerRolling[]>(
      playerRolling(player.id),
    );
    if (result[0].current_rolling < result[0].required_rolling) {
      this.prisma.error(ResCode.ROLLING_NO_ENOUGH, '流水未達標準');
    }
    // 驗證客戶的卡片
    const playerCard = await this.prisma.playerCard.findFirst({
      where: {
        id: player_card_id,
        player_id: this.player.id,
        valid_status: ValidateStatus.APPROVED,
      },
    });
    if (!playerCard) {
      this.prisma.error(ResCode.FIELD_NOT_VALID, '卡片不可用');
    }

    // 若有審核中的提領單則駁回
    const withdraws = await this.prisma.withdrawRec.findMany({
      where: {
        player: { id: this.player.id },
        status: {
          in: [ProcessStatus.UNPROCESSED, ProcessStatus.PROCESSING],
        },
      },
    });
    if (withdraws.length) {
      this.prisma.error(ResCode.FIELD_NOT_VALID, '不可重複申請提領');
    }

    // 查詢VIP等級的提領限制
    const vip = await this.prisma.vip.findFirst({
      where: {
        id: this.player.vip_id,
      },
    });

    if (amount > vip.withdraw_max) {
      this.prisma.error(
        ResCode.FIELD_NOT_VALID,
        `最高提領限額為${vip.withdraw_max}元`,
      );
    }
    if (amount < vip.withdraw_min) {
      this.prisma.error(
        ResCode.FIELD_NOT_VALID,
        `最低提領限額為${vip.withdraw_min}元`,
      );
    }

    // 查詢會員出金紀錄
    const withdrawTag = await this.prisma.playerTag.findFirst({
      where: {
        player_id: this.player.id,
        type: PlayerTagType.WITHDRAWED,
      },
    });

    // +1為累計此次提領次數
    const withdrawCount = (withdrawTag?.count || 0) + 1;

    // 依照VIP等級查詢此提領單的手續費%數
    let fee_percent = vip.withdraw_fee;
    if (withdrawCount <= 3) {
      fee_percent = vip[`withdraw_fee_${withdrawCount}`];
    }

    //  新增提領
    const record = await this.prisma.withdrawRec.create({
      data: {
        amount,
        player_id: this.player.id,
        player_card_id,
        fee: (amount * fee_percent) / 100,
        times: withdrawCount,
      },
      include: {
        player: {
          include: {
            vip: true,
            agent: true,
          },
        },
      },
    });

    const notify: WithdrawPayload = {
      id: record.id,
      status: 'apply',
      username: record.player.username,
      nickname: record.player.nickname,
      created_at: record.created_at,
      amount: record.amount,
      vip_name: record.player.vip.name,
      count: record.times,
      agent_nickname: record.player.agent.nickname,
      agent_username: record.player.agent.username,
    };

    this.eventEmitter.emit('withdraw.apply', notify);

    return this.prisma.success();
  }

  findAll(search: SearchWithdrawsDto) {
    const { created_start_at, created_end_at } = search;
    return this.prisma.withdrawRec.findMany({
      select: {
        amount: true,
        status: true,
        player_card: {
          select: {
            bank_code: true,
            branch: true,
            name: true,
            account: true,
          },
        },
        outter_note: true,
        fee: true,
      },
      where: {
        player_id: this.player.id,
      },
    });
  }
}
