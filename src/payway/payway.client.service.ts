import { getCurrentPayways } from './raw/getCurrentPayways';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaywayDto } from './dto/create-payway.dto';
import { UpdatePaywayDto } from './dto/update-payway.dto';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class PaywayClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private request: Request,
  ) {}
  platform = this.configService.get('PLATFORM');

  get player() {
    return this.request.user as Player;
  }
  create(createPaywayDto: CreatePaywayDto) {
    return 'This action adds a new payway';
  }

  async findAll() {
    return this.prisma.$queryRaw(getCurrentPayways(this.player.vip_id));
  }

  findOne(id: number) {
    return `This action returns a #${id} payway`;
  }

  update(id: number, updatePaywayDto: UpdatePaywayDto) {
    return `This action updates a #${id} payway`;
  }

  remove(id: number) {
    return `This action removes a #${id} payway`;
  }
}
