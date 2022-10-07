import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TelegramBot } from '@prisma/client';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepositPayload, WithdrawPayload } from 'src/socket/types';
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
        parse_mode: 'MarkdownV2',
      },
    });
  }

  @OnEvent('deposit.apply.*', { async: true })
  async sendDepositApplyMsg(payload: DepositPayload) {
    const { type, username, amount } = payload;
    const typeMap: Record<typeof type, string> = {
      bank: '銀行卡',
      payment: '三方支付',
    };
    const bots = await this.prisma.telegramBot.findMany({
      where: { type: TelegramBotType.RECHARGE, is_active: true },
    });
    await Promise.all(
      bots.map((bot) => {
        return this.sendMessage(
          bot,
          `🛎 ${username} 申請${typeMap[type]}儲值 $*${amount}*`,
        );
      }),
    );
  }

  @OnEvent('deposit.finish.*', { async: true })
  async sendDepositFinishMsg(payload: DepositPayload) {
    const { type, username, amount } = payload;
    const typeMap: Record<typeof type, string> = {
      bank: '銀行卡',
      payment: '三方支付',
    };
    const bots = await this.prisma.telegramBot.findMany({
      where: { type: TelegramBotType.RECHARGE, is_active: true },
    });
    await Promise.all(
      bots.map((bot) => {
        return this.sendMessage(
          bot,
          `🎉 ${username} ${typeMap[type]}儲值成功 $*${amount}*`,
        );
      }),
    );
  }

  @OnEvent('withdraw.apply', { async: true })
  async sendWithdrawApplyMsg(payload: WithdrawPayload) {
    const { username, amount } = payload;
    const bots = await this.prisma.telegramBot.findMany({
      where: { type: TelegramBotType.WITHDRAW, is_active: true },
    });
    await Promise.all(
      bots.map((bot) => {
        return this.sendMessage(bot, `📤 ${username} 申請出金 $*${amount}*`);
      }),
    );
  }

  @OnEvent('withdraw.finish', { async: true })
  async sendWithdrawFinishMsg(payload: WithdrawPayload) {
    const { username, amount } = payload;
    const bots = await this.prisma.telegramBot.findMany({
      where: { type: TelegramBotType.WITHDRAW, is_active: true },
    });
    await Promise.all(
      bots.map((bot) => {
        return this.sendMessage(bot, `💥 ${username} 出金完成 $*${amount}*`);
      }),
    );
  }
}
