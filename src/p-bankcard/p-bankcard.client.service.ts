import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { CreatePBankcardDto } from './dto/create-p-bankcard.dto';
import { UpdatePBankcardDto } from './dto/update-p-bankcard.dto';
import { Request } from 'express';
import { User } from 'src/decorators/user.decorator';

@Injectable({ scope: Scope.REQUEST })
export class PBankcardClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private request: Request,
  ) {}
  platform = this.configService.get('PLATFORM');

  get player() {
    return this.request.user as Player;
  }
  async create(data: CreatePBankcardDto) {
    const defaultCards = await this.prisma.playerCard.findMany({
      where: { player_id: this.player.id, is_default: true },
    });
    return this.prisma.playerCard.create({
      data: {
        ...data,
        is_default: !defaultCards.length, // 有預設卡片則新卡片不為預設
        player_id: this.player.id,
      },
    });
  }

  findAll() {
    return this.prisma.playerCard.findMany({
      where: {
        player_id: this.player.id,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} pBankcard`;
  }

  update(id: number, updatePBankcardDto: UpdatePBankcardDto) {
    return `This action updates a #${id} pBankcard`;
  }

  remove(id: number) {
    return `This action removes a #${id} pBankcard`;
  }
}
