import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProcessStatus } from 'src/enums';
import { ResCode } from 'src/errors/enums';
import { PlayerTagType } from 'src/player/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepositPayload } from 'src/socket/types';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from './../wallet-rec/wallet-rec.service';

@Injectable()
export class OrderResponseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async orderSuccess(record_id: string, resData?: any) {
    const record = await this.prisma.paymentDepositRec.findUnique({
      where: { id: record_id },
      include: {
        player: {
          include: {
            vip: true,
            agent: true,
          },
        },
        merchant: true,
        payway: true,
      },
    });

    // 查看該訂單狀態是否為未完成
    if (record.status >= 10) {
      this.prisma.error(ResCode.DUPICATED_OPERATION);
    }

    // 查看玩家是否有儲值紀錄
    const rechargedTag = await this.prisma.playerTag.findFirst({
      where: { player_id: record.player.id, type: PlayerTagType.RECHARGED },
    });

    if (!rechargedTag) {
      // 無儲值紀錄則將玩家打上儲值紀錄
      await this.prisma.playerTag.create({
        data: {
          player_id: record.player.id,
          type: PlayerTagType.RECHARGED,
        },
      });
    }

    const finished_at = new Date();

    await this.prisma.$transaction([
      this.prisma.paymentDepositRec.update({
        where: { id: record.id },
        data: {
          paid_at: finished_at,
          finished_at,
          status: ProcessStatus.FINISHED,
          notify_info: resData,
          is_first: !rechargedTag, // 無儲值紀錄則將此單標記為首儲
        },
      }),
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.PAYMENT_DEPOSIT,
        player_id: record.player_id,
        amount: record.amount,
        fee: record.fee_on_player,
        source: `${record.merchant.name}(${record.merchant.code})/${record.payway.name}(${record.payway.code})`,
        relative_id: record.id,
      })),
    ]);

    const notify: DepositPayload = {
      type: 'payment',
      status: 'finish',
      id: record.id,
      username: record.player.username,
      nickname: record.player.nickname,
      created_at: record.created_at,
      finished_at,
      amount: record.amount,
      vip_name: record.player.vip.name,
      // count: record.times,
      agent_nickname: record.player.agent.nickname,
      agent_username: record.player.agent.username,
    };

    this.eventEmitter.emit('deposit.finish.payment', notify);
  }
  async orderFailed(record_id: string, resData: any) {
    const finished_at = new Date();
    await this.prisma.paymentDepositRec.update({
      where: { id: record_id },
      data: {
        canceled_at: finished_at,
        finished_at,
        status: ProcessStatus.REJECTED,
        notify_info: resData,
      },
    });
  }
}
