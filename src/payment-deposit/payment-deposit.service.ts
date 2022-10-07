import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDepositDto } from './dto/create-payment-deposit.dto';
import { UpdatePaymentDepositDto } from './dto/update-payment-deposit.dto';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Player, Prisma } from '@prisma/client';
import { SearchPaymentDepositsDto } from './dto/search-payment-deposits.dto';

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

  async findAll(search: SearchPaymentDepositsDto) {
    const {
      created_start_at,
      created_end_at,
      username,
      status,
      page,
      perpage,
    } = search;
    const findManyArgs: Prisma.PaymentDepositRecFindManyArgs = {
      where: {
        player: {
          username,
        },
        created_at: {
          gte: created_start_at,
          lte: created_end_at,
        },
        status,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: perpage,
      skip: (page - 1) * perpage,
    };
    return this.prisma.listFormat({
      items: await this.prisma.paymentDepositRec.findMany(findManyArgs),
      count: await this.prisma.paymentDepositRec.count({
        where: findManyArgs.where,
      }),
    });
  }
}
