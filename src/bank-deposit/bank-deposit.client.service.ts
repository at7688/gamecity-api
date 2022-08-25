import { SearchBankDepositsDto } from './dto/search-bank-deposits.dto';
import { Inject, Injectable, Scope, BadRequestException } from '@nestjs/common';
import { CreateBankDepositDto } from './dto/create-bank-deposit.dto';
import { UpdateBankDepositDto } from './dto/update-bank-deposit.dto';
import { LoginUser } from 'src/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { Player } from '@prisma/client';
import { CardInfo, getCurrentCard } from './raw/getCurrentCard';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class BankDepositClientService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}

  get player() {
    return this.request.user as Player;
  }

  async create(data: CreateBankDepositDto) {
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

    // 取得當前輪替的卡片們
    const cards = await this.prisma.$queryRaw<CardInfo[]>(
      getCurrentCard(this.player.id),
    );

    // 若無限額內可用卡片則提示錯誤
    if (cards.length === 0) {
      throw new BadRequestException('暫無提供儲值，請聯繫客服');
    }

    // 取得當前運作的卡片
    let card = cards.find((t) => t.is_current);

    // 若無當前運作中卡片則開啟限額內的備用卡片
    if (!card) {
      card = cards[0];
      await this.prisma.companyCard.update({
        where: { id: card.card_id },
        data: { is_current: true },
      });
    }

    // 若儲值後超出限額，則關閉當前卡片
    if (amount + card.current_sum > card.deposit_max) {
      await this.prisma.companyCard.update({
        where: { id: card.card_id },
        data: { is_current: false },
      });
    }

    //  新增儲值
    return this.prisma.bankDepositRec.create({
      select: {
        id: true,
        amount: true,
        created_at: true,
      },
      data: {
        amount,
        card_id: card.card_id,
        player_id: this.player.id,
        player_card_id,
      },
    });
  }

  findAll(search: SearchBankDepositsDto, user: LoginUser) {
    const {
      nickname,
      username,
      account,
      name,
      created_start_at,
      created_end_at,
      amount_from,
      amount_to,
    } = search;
    return this.prisma.bankDepositRec.findMany({
      where: {
        player_id: this.player.id,
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} bankDeposit`;
  }

  update(id: string, data: UpdateBankDepositDto) {
    const { inner_note, outter_note, status } = data;
    return this.prisma.bankDepositRec.update({
      where: { id },
      data: { inner_note, outter_note, status },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} bankDeposit`;
  }
}
