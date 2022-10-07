import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramBotController } from './telegram-bot.controller';
import { TGMessageService } from './tg-message.service';

@Module({
  controllers: [TelegramBotController],
  providers: [TelegramBotService, TGMessageService],
})
export class TelegramBotModule {}
