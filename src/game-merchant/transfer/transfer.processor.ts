import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType, WalletStatus } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { AbService } from '../ab/ab.service';
import { PlatformsBridgeService } from '../platforms-bridge/platforms-bridge.service';
import { TransferQueue } from '../types';
import { TransferStatus } from './enums';

@Processor('transfer')
export class TransferProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly bridgeService: PlatformsBridgeService,
    @InjectQueue('transfer')
    private readonly transferQueue: Queue<TransferQueue>,
  ) {}
  private readonly Logger = new Logger(TransferProcessor.name);

  @Process('transTo')
  async transToConsumer(job: Job<TransferQueue>) {
    const { platform_code, trans_id } = job.data;
    let { retryTimes } = job.data;
    this.Logger.log(`TRANS_TO_CHECKER (${platform_code})`);

    try {
      const status = await this.bridgeService.transferCheck(
        platform_code,
        trans_id,
      );

      if (status === TransferStatus.SUCCESS) {
        await this.transToRetrySuccess(trans_id);
      }
      if (status === TransferStatus.FAILED) {
        await this.transToRetryFailed(trans_id);
      }
      if (status === TransferStatus.PENDING) {
        throw new Error('pending');
      }
    } catch (err) {
      if (retryTimes >= 4) {
        await this.transToRetryFailed(trans_id);
        return;
      }
      await this.transferQueue.add(
        {
          ...job.data,
          retryTimes: ++retryTimes,
        },
        {
          delay: 1000 * 60 * { 2: 30, 3: 60, 4: 120 }[retryTimes],
          // 第2次: 30分, 第3次: 60分, 第4次: 120分
        },
      );
    }
  }
  async transToRetryFailed(trans_id: string) {
    const record = await this.prisma.walletRec.findFirst({
      where: {
        relative_id: trans_id,
        type: WalletRecType.TRANS_TO_GAME,
      },
    });

    await this.prisma.$transaction([
      this.prisma.walletRec.updateMany({
        where: {
          relative_id: trans_id,
          type: WalletRecType.TRANS_TO_GAME,
        },
        data: {
          status: WalletStatus.FAILED,
        },
      }),
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.TRANS_TO_GAME_CANCELED,
        player_id: record.player_id,
        amount: Math.abs(record.amount),
        source: record.source,
        relative_id: trans_id,
        note: '轉入遊戲失敗',
      })),
    ]);
  }

  async transToRetrySuccess(trans_id: string) {
    await this.prisma.walletRec.updateMany({
      where: {
        relative_id: trans_id,
        type: WalletRecType.TRANS_TO_GAME,
      },
      data: {
        status: WalletStatus.DONE,
      },
    });
  }
}
