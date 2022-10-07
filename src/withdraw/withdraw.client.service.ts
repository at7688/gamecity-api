import { ValidStatus } from './../p-bankcard/enums';
import { SearchWithdrawsDto } from './dto/search-withdraws.dto';
import { Inject, Injectable, Scope, BadRequestException } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { LoginUser } from 'src/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from '@prisma/client';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { WithdrawStatus } from './enums';
import { ResCode } from 'src/errors/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WithdrawPayload } from 'src/socket/types';
import { PlayerTagType } from 'src/player/enums';

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

    if (amount > player.balance) {
      this.prisma.error(ResCode.BALANCE_NOT_ENOUGH, '餘額不足');
    }
    // 驗證客戶的卡片
    const playerCard = await this.prisma.playerCard.findFirst({
      where: {
        id: player_card_id,
        player_id: this.player.id,
        valid_status: ValidStatus.VALID,
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
          in: [WithdrawStatus.APPLYING, WithdrawStatus.PROCESSING],
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
    await this.prisma.withdrawRec.create({
      select: {
        id: true,
        amount: true,
        created_at: true,
      },
      data: {
        amount,
        player_id: this.player.id,
        player_card_id,
        fee: (amount * fee_percent) / 100,
        times: withdrawCount,
      },
    });

    this.eventEmitter.emit('withdraw.apply', {
      username: this.player.username,
      amount,
    } as WithdrawPayload);

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
