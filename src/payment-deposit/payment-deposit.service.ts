import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Player, Prisma } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchPaymentDepositsDto } from './dto/search-payment-deposits.dto';
import { UpdatePaymentDepositDto } from './dto/update-payment-deposit.dto';

@Injectable({ scope: Scope.REQUEST })
export class PaymentDepositService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private request: Request,
  ) {}

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
      include: {
        player: {
          select: {
            id: true,
            nickname: true,
            username: true,
            vip: {
              select: {
                id: true,
                icon: true,
                name: true,
              },
            },
          },
        },
        payway: {
          select: {
            id: true,
            name: true,
            type: true,
            tool: {
              select: {
                id: true,
                tool_name: true,
                merchant_config: true,
                merchant: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
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

  async update(data: UpdatePaymentDepositDto) {
    const { id, inner_note, outter_note } = data;
    await this.prisma.paymentDepositRec.update({
      where: {
        id,
      },
      data: {
        inner_note,
        outter_note,
      },
    });
    return this.prisma.success();
  }
}
