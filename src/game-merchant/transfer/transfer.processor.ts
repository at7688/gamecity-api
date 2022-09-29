import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { AbService } from '../ab/ab.service';
import { TransferQueue } from '../types';

@Processor('transfer')
export class TransferProcessor {
  constructor(
    private readonly abService: AbService,
    @InjectQueue('transfer')
    private readonly transferQueue: Queue<TransferQueue>,
  ) {}
  private readonly Logger = new Logger(TransferProcessor.name);

  @Process('ab')
  async abTransConsumer(job: Job<TransferQueue>) {
    const trans_id = job.data.trans_id;
    let { retryTimes } = job.data;
    this.Logger.log(`AB_TRANS_CHECKER (${trans_id})`);
    const isPass = await this.abService.transferCheck(trans_id);

    if (!isPass) {
      if (retryTimes >= 4) {
        return;
      }
      await this.transferQueue.add(
        'ab',
        {
          ...job.data,
          retryTimes: ++retryTimes,
        },
        {
          delay: 1000 * 60 * { 2: 30, 3: 60, 4: 120 }[retryTimes],
          // 第2次: 30分, 第3次: 60分, 第4次: 120分
        },
      );
      return;
    }

    console.log(`Job Sucess!`);
  }
}
