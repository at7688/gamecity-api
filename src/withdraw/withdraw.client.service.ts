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

@Injectable({ scope: Scope.REQUEST })
export class WithdrawClientService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}

  get player() {
    return this.request.user as Player;
  }

  async create(data: CreateWithdrawDto) {
    const { amount, player_card_id } = data;

    // 驗證客戶的卡片
    const playerCard = (
      await this.prisma.playerCard.findMany({
        where: {
          id: player_card_id,
          player_id: this.player.id,
          valid_status: ValidStatus.VALID,
        },
      })
    )[0];
    if (!playerCard) {
      throw new BadRequestException('卡片不可用');
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
      throw new BadRequestException('不可重複申請提領');
    }

    // 查詢VIP等級的提領限制
    const vip = (
      await this.prisma.vip.findMany({
        where: {
          id: this.player.vip_id,
        },
      })
    )[0];

    if (amount > vip.withdraw_max) {
      throw new BadRequestException(`最高提領限額為${vip.withdraw_max}元`);
    }
    if (amount < vip.withdraw_min) {
      throw new BadRequestException(`最低提領限額為${vip.withdraw_min}元`);
    }

    // 依照VIP等級查詢此提領單的手續費%數
    const times = this.player.withdraw_nums;

    let withdraw_fee = vip.withdraw_fee;
    if (times < 3) {
      withdraw_fee = vip[`withdraw_fee_${times}`];
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
        withdraw_fee,
      },
    });

    return {
      success: true,
    };
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
        withdraw_fee: true,
      },
      where: {
        player_id: this.player.id,
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} bankWithdraw`;
  }

  update(id: string, data: UpdateWithdrawDto) {
    const { inner_note, outter_note, status } = data;
    return this.prisma.withdrawRec.update({
      where: { id },
      data: { inner_note, outter_note, status },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} bankWithdraw`;
  }
}
