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

    const card = (
      await this.prisma.$queryRaw<CardInfo[]>(getCurrentCard(this.player.id))
    )[0];

    if (!card) {
      throw new BadRequestException('暫無提供儲值，請聯繫客服');
    }

    console.log(card);

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
