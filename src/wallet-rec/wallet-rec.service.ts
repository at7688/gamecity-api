import { Injectable } from '@nestjs/common';
import * as numeral from 'numeral';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletRecDto } from './dto/create-wallet-rec.dto';

@Injectable()
export class WalletRecService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.walletRec.findMany();
  }

  async create(data: CreateWalletRecDto) {
    const {
      type,
      player_id,
      amount,
      source,
      fee,
      operator_id,
      note,
      relative_id,
    } = data;
    const player = await this.prisma.player.findUnique({
      where: { id: player_id },
    });
    return [
      this.prisma.walletRec.create({
        data: {
          type,
          player_id,
          amount,
          origin_amount: player.balance,
          source,
          fee,
          operator_id,
          note,
          relative_id,
        },
      }),
      this.prisma.player.update({
        where: { id: player_id },
        data: {
          balance: {
            set: numeral(player.balance).add(amount).subtract(fee).value(),
          },
        },
      }),
    ];
  }
}
