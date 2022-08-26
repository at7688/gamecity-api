import { SearchWithdrawsDto } from './dto/search-withdraws.dto';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Prisma } from '@prisma/client';
import { WithdrawStatus } from './enums';

@Injectable()
export class WithdrawService {
  constructor(private readonly prisma: PrismaService) {}
  create(createWithdrawDto: CreateWithdrawDto) {
    return 'This action adds a new bankWithdraw';
  }

  async findAll(search: SearchWithdrawsDto) {
    const {
      nickname,
      username,
      account,
      name,
      created_start_at,
      created_end_at,
      amount_from,
      amount_to,
      status,
    } = search;

    const findManyArgs: Prisma.WithdrawRecFindManyArgs = {
      where: {
        status,
        player: {
          nickname: {
            contains: nickname,
          },
          username: {
            contains: username,
          },
        },
        player_card: {
          account: {
            contains: account,
          },
          name: {
            contains: name,
          },
        },
        created_at: {
          gte: created_start_at,
          lte: created_end_at,
        },
        amount: {
          gte: amount_from,
          lte: amount_to,
        },
      },
      include: {
        player: {
          select: {
            id: true,
            nickname: true,
            username: true,
            withdraw_nums: true,
          },
        },
        player_card: {
          select: {
            id: true,
            bank_code: true,
            branch: true,
            name: true,
            account: true,
          },
        },
      },
    };
    return this.prisma.listFormat({
      items: await this.prisma.withdrawRec.findMany(findManyArgs),
      count: await this.prisma.withdrawRec.count({
        where: findManyArgs.where,
      }),
    });
  }

  findOne(id: string) {
    return this.prisma.withdrawRec.findUnique({
      where: { id },
      include: {
        player: {
          select: {
            id: true,
            nickname: true,
            username: true,
          },
        },
        player_card: {
          select: {
            id: true,
            bank_code: true,
            branch: true,
            name: true,
            account: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateWithdrawDto) {
    const { inner_note, outter_note, status, withdraw_fee } = data;

    await this.prisma.withdrawRec.update({
      where: { id },
      data: { inner_note, outter_note, status, withdraw_fee },
    });
    // 若狀態為已撥款，則累計進會員提領次數
    if (status === WithdrawStatus.FINISHED) {
      await this.prisma.player.updateMany({
        where: { withdraws: { some: { id } } },
        data: { withdraw_nums: { increment: 1 } },
      });
    }
    return { success: true };
  }
}
