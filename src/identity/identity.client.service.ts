import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Player } from '@prisma/client';
import { Request } from 'express';
import { ResCode } from 'src/errors/enums';
import { PlayerTagType } from 'src/player/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIdentityDto } from './dto/create-identity.dto';

@Injectable({ scope: Scope.REQUEST })
export class IdentityClientService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private request: Request,
  ) {}

  get player() {
    return this.request.user as Player;
  }
  async create(data: CreateIdentityDto) {
    const { id_card_num, img_ids } = data;

    // 查詢是否有實名標籤
    const idTag = await this.prisma.playerTag.findUnique({
      where: {
        player_id_type: {
          player_id: this.player.id,
          type: PlayerTagType.VERIFIED_ID,
        },
      },
    });
    if (idTag) {
      this.prisma.success(ResCode.ALREADY_VARIFIED, '已驗證過');
    }
    await this.prisma.identityVerify.upsert({
      where: { player_id: this.player.id },
      create: {
        player_id: this.player.id,
        id_card_num,
        imgs: { connect: img_ids.map((id) => ({ id })) },
      },
      update: {
        id_card_num,
        imgs: { connect: img_ids.map((id) => ({ id })) },
      },
    });
    return this.prisma.success();
  }

  async findOne() {
    const result = await this.prisma.identityVerify.findUnique({
      where: { player_id: this.player.id },
      include: { imgs: { select: { id: true, path: true } } },
    });
    return this.prisma.success(result);
  }
}
