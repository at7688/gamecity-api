import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TelegramBot } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import * as numeral from 'numeral';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  DepositPayload,
  RegisterPayload,
  WithdrawPayload,
} from 'src/socket/types';
import { TelegramBotType } from './enums';

@Injectable()
export class TGMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(bot: TelegramBot, text: string) {
    const { chat_id, token, type } = bot;
    await axios.request({
      method: 'POST',
      url: `https://api.telegram.org/bot${token}/sendMessage`,
      data: {
        chat_id,
        text,
        parse_mode: 'HTML',
      },
    });
  }

  @OnEvent('deposit.**', { async: true })
  async sendDepositApplyMsg(payload: DepositPayload) {
    console.log('sendDepositApplyMsg');
    const {
      type,
      status,
      username,
      nickname,
      vip_name,
      created_at,
      finished_at,
      amount,
      agent_username,
      agent_nickname,
      count,
    } = payload;

    console.log(payload);

    const typeMap: Record<typeof type, string> = {
      bank: '銀行卡',
      payment: '三方支付',
    };
    const bots = await this.prisma.telegramBot.findMany({
      where: { type: TelegramBotType.RECHARGE, is_active: true },
    });

    const msgMap: Record<typeof status, string> = {
      apply: `
      <b>[訂貨申請通知]🛎</b>
      申請時間：${format(created_at, 'yyyy-MM-dd HH:mm:ss')}
      訂貨方式：${typeMap[type]}
      上層代理：${agent_username}(${agent_nickname})
      訂貨人：${username}(${nickname})
      訂貨代碼：${numeral(amount).format('0,0.00')}
      訂貨級別：${vip_name}
    `,
      finish: `
      <b>[訂貨完成通知]🎉</b>
      申請時間：${format(created_at, 'yyyy-MM-dd HH:mm:ss')}
      完成時間：${
        finished_at ? format(finished_at, 'yyyy-MM-dd HH:mm:ss') : '-'
      }
      訂貨方式：${typeMap[type]}
      上層代理：${agent_username}(${agent_nickname})
      訂貨人：${username}(${nickname})
      訂貨代碼：${numeral(amount).format('0,0.00')}
      訂貨級別：${vip_name}
  `,
    };
    await Promise.all(
      bots.map((bot) => {
        return this.sendMessage(bot, msgMap[status]);
      }),
    );
  }

  @OnEvent('withdraw.*', { async: true })
  async sendWithdrawApplyMsg(payload: WithdrawPayload) {
    const {
      username,
      nickname,
      vip_name,
      created_at,
      finished_at,
      status,
      amount,
      agent_username,
      agent_nickname,
      count,
    } = payload;
    const bots = await this.prisma.telegramBot.findMany({
      where: { type: TelegramBotType.WITHDRAW, is_active: true },
    });
    const msgMap: Record<typeof status, string> = {
      apply: `
      <b>[出貨申請通知]📤</b>
      申請時間：${format(created_at, 'yyyy-MM-dd HH:mm:ss')}
      上層代理：${agent_username}(${agent_nickname})
      出貨人：${username}(${nickname})
      出貨代碼：${numeral(amount).format('0,0.00')}
      出貨級別：${vip_name}
      出貨次數：${count}
    `,
      finish: `
    <b>[出貨完成通知]💥</b>
    申請時間：${format(created_at, 'yyyy-MM-dd HH:mm:ss')}
    完成時間：${finished_at ? format(finished_at, 'yyyy-MM-dd HH:mm:ss') : '-'}
    上層代理：${agent_username}(${agent_nickname})
    出貨人：${username}(${nickname})
    出貨代碼：${numeral(amount).format('0,0.00')}
    出貨級別：${vip_name}
    出貨次數：${count}
  `,
    };
    await Promise.all(
      bots.map((bot) => {
        return this.sendMessage(bot, msgMap[status]);
      }),
    );
  }

  @OnEvent('player.register', { async: true })
  async sendPlayerRegisterMsg(payload: RegisterPayload) {
    const {
      username,
      time,
      master_agent_username,
      master_agent_nickname,
      agent_username,
      agent_nickname,
    } = payload;
    const bots = await this.prisma.telegramBot.findMany({
      where: { type: TelegramBotType.REGISTER, is_active: true },
    });
    const msg = `
    <b>[註冊通知]🤠</b>
    註冊時間：${format(time, 'yyyy-MM-dd HH:mm:ss')}
    上層總代：${master_agent_username}(${master_agent_nickname})
    上層代理：${agent_username}(${agent_nickname})
    客戶帳號：${username}
  `;
    try {
      await Promise.all(
        bots.map((bot) => {
          return this.sendMessage(bot, msg);
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }
}
