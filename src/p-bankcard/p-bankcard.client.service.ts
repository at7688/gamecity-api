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
    // 查詢是否該玩家有預設卡片
    const defaultCards = await this.prisma.playerCard.findMany({
      where: { player_id: this.player.id, is_default: true },
    });
    await this.prisma.playerCard.create({
      data: {
        bank_code,
        branch,
        name,
        account,
        imgs: { connect: img_ids.map((id) => ({ id })) },
        is_default: !defaultCards.length, // 有預設卡片則新卡片不為預設
        player_id: this.player.id,
      },
    });

    this.eventEmitter.emit('bankcard', {
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
