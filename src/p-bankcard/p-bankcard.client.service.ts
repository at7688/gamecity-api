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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerCardPayload } from 'src/socket/types';
import { ResCode } from 'src/errors/enums';

@Injectable({ scope: Scope.REQUEST })
export class PBankcardClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(REQUEST) private request: Request,
  ) {}
  platform = this.configService.get('PLATFORM');

  get player() {
    return this.request.user as Player;
  }
  async create(data: CreatePBankcardDto) {
    const { bank_code, branch, name, account, img_ids } = data;

    const cards = await this.prisma.playerCard.findMany({
      where: { player_id: this.player.id },
    });

    // 查看該會員的VIP等級可綁定卡片是否超過
    const vip = await this.prisma.vip.findUnique({
      where: { id: this.player.vip_id },
    });
    if (cards.length >= vip.card_count) {
      this.prisma.error(ResCode.OVER_PLAYER_CARD_LIMIT, '超過可申請的卡片上限');
    }
    // 查詢是否該玩家有預設卡片, 無則設定該張卡為預設卡
    const defaultCards = cards.filter((t) => !!t.is_default);

    await this.prisma.playerCard.create({
      data: {
        bank_code,
        branch,
        name,
        account,
        imgs: { connect: img_ids.map((id) => ({ id })) },
        is_default: !defaultCards.length,
        player_id: this.player.id,
      },
    });

    this.eventEmitter.emit('playerCard.apply', {
      username: this.player.username,
      info: `(${bank_code})${account} ${name}`,
    } as PlayerCardPayload);

    return this.prisma.success();
  }

  async findAll() {
    const list = await this.prisma.playerCard.findMany({
      where: {
        player_id: this.player.id,
      },
    });
    return this.prisma.success(list);
  }

  update(id: string, data: UpdatePBankcardDto) {
    const { bank_code, branch, name, account, img_ids } = data;
    return this.prisma.playerCard.update({
      where: { id },
      data: {
        bank_code,
        branch,
        name,
        account,
        imgs: { connect: img_ids.map((id) => ({ id })) },
      },
    });
  }

  async default(id: string) {
    await this.prisma.$transaction([
      this.prisma.playerCard.updateMany({
        where: { player_id: this.player.id },
        data: {
          is_default: false,
        },
      }),
      this.prisma.playerCard.updateMany({
        where: { id, player_id: this.player.id },
        data: {
          is_default: true,
        },
      }),
    ]);
    return this.prisma.success();
  }
}
