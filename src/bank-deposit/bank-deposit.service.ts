import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { SearchBankDepositsDto } from './dto/search-bank-deposits.dto';
import { UpdateBankDepositDto } from './dto/update-bank-deposit.dto';

@Injectable()
export class BankDepositService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  async findAll(search: SearchBankDepositsDto) {
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

    const findManyArgs: Prisma.BankDepositRecFindManyArgs = {
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
      orderBy: { created_at: 'desc' },
    };
    return this.prisma.listFormat({
      items: await this.prisma.bankDepositRec.findMany(findManyArgs),
      count: await this.prisma.bankDepositRec.count({
        where: findManyArgs.where,
      }),
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} bankDeposit`;
  }

  async update(id: string, data: UpdateBankDepositDto) {
    const { inner_note, outter_note, status } = data;
    const record = await this.prisma.bankDepositRec.update({
      where: { id },
      data: { inner_note, outter_note, status },
      include: { card: true, player_card: true },
    });
    await this.prisma.$transaction([
      this.prisma.bankDepositRec.update({
        where: { id },
        data: { inner_note, outter_note, status },
      }),
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BANK_DEPOSIT,
        player_id: record.player_id,
        amount: record.amount,
        fee: 0,
        source: `(${record.card.bank_code})${record.card.account}`,
        relative_id: record.id,
      })),
    ]);
    return this.prisma.success();
  }
}
