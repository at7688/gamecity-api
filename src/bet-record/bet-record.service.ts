import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BetCreateInput } from './type';
import { WalletRecType } from 'src/wallet-rec/enums';
import { Player } from '@prisma/client';

@Injectable()
export class BetRecordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  // async create(diffAmount: number, data: BetCreateInput) {
  //   const record = await this.prisma.betRecord.create({
  //     data,
  //     include: { game: true, platform: true },
  //   });
  //   await this.prisma.$transaction([
  //     this.prisma.betRecord.create({
  //       data,
  //     }),
  //     ...(await this.walletRecService.playerCreate({
  //       type: WalletRecType.BETTING,
  //       player_id: data.player_id,
  //       amount: diffAmount,
  //       source: `${record.platform.name}|${record.game.code}`,
  //       relative_id: record.bet_no,
  //     })),
  //   ]);
  //   return { success: true };
  // }
}
