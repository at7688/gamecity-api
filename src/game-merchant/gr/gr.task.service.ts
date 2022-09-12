import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GrService } from './gr.service';

@Injectable()
export class GrTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly grService: GrService,
  ) {}
  private readonly logger = new Logger(GrTaskService.name);

  @Cron(CronExpression.EVERY_30_MINUTES)
  async logTest() {
    await this.grService.fetchBetRecords();
    this.logger.log('GR_FETCH_BET_RECORDS');
  }
}
