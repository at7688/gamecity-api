import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Player } from '@prisma/client';
import { Request } from 'express';
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
  create(data: CreateIdentityDto) {
    const { id_card_num, img_ids } = data;
    return this.prisma.identityVerify.upsert({
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
      include: { imgs: { select: { id: true, path: true, filename: true } } },
    });
  }

  findOne() {
    return this.prisma.identityVerify.findUnique({
      where: { player_id: this.player.id },
      include: { imgs: { select: { id: true, path: true } } },
    });
  }
}
