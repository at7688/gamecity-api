import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { AviaService } from './avia.service';

@Injectable()
export class AviaTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly aviaService: AviaService,
  ) {}
  private readonly logger = new Logger(AviaTaskService.name);

  @Cron(CronExpression.EVERY_30_MINUTES)
  async logTest() {
    await this.aviaService.fetchBetRecords();
    this.logger.log('AVIA_FETCH_BET_RECORDS');
  }
}
