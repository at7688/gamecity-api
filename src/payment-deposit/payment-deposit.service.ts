import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDepositDto } from './dto/create-payment-deposit.dto';
import { UpdatePaymentDepositDto } from './dto/update-payment-deposit.dto';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Player } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class PaymentDepositService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private request: Request,
  ) {}
  platform = this.configService.get('PLATFORM');

  get player() {
    return this.request.user as Player;
  }
  create(data: CreatePaymentDepositDto) {
    const { amount, payway_id } = data;

    // return this.prisma.paymentDepositRec.create({
    //   data: {
    //     amount,
    //     player_id: this.player.id,
    //     payway_id,
    //   },
    // });
  }

  findAll() {
    return this.prisma.paymentDepositRec.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentDeposit`;
  }

  update(id: number, updatePaymentDepositDto: UpdatePaymentDepositDto) {
    return `This action updates a #${id} paymentDeposit`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentDeposit`;
  }
}
