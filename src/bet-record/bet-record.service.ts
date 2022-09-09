import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';

@Injectable()
export class BetRecordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // fetchAbBetRecord() {
  //   console.log('hi');
  // }

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
