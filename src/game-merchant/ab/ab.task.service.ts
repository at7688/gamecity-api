import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { AbService } from './ab.service';

@Injectable()
export class AbTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly abService: AbService,
  ) {}
  private readonly logger = new Logger(AbTaskService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  logTest() {
    this.logger.debug('CronExpression.EVERY_10_SECONDS');
  }
}
