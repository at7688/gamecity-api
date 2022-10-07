import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TelegramBot } from '@prisma/client';
import axios from 'axios';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepositPayload } from 'src/socket/types';
import { CreateTelegramBotDto } from './dto/create-telegram-bot.dto';
import { UpdateTelegramBotDto } from './dto/update-telegram-bot.dto';
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

  @OnEvent('deposit')
  async sendRechargeMsg(payload: DepositPayload) {
    const { username, amount } = payload;
    const bots = await this.prisma.telegramBot.findMany({
      where: { type: TelegramBotType.RECHARGE, is_active: true },
    });
    await Promise.all(
      bots.map((bot) => {
        return this.sendMessage(bot, `🎉 玩家 ${username} 儲值 $*${amount}*`);
      }),
    );
  }
}
