import { SearchWithdrawsDto } from './dto/search-withdraws.dto';
import { Inject, Injectable, Scope, BadRequestException } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { LoginUser } from 'src/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from '@prisma/client';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

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
        },
      })
    )[0];
    if (!playerCard) {
      return new BadRequestException('查無卡片');
    }

    //  新增儲值
    return this.prisma.withdrawRec.create({
      select: {
        id: true,
        amount: true,
        created_at: true,
      },
      data: {
        amount,
        player_id: this.player.id,
        player_card_id,
      },
    });
  }

  findAll(search: SearchWithdrawsDto) {
    const { created_start_at, created_end_at } = search;
    return this.prisma.withdrawRec.findMany({
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
