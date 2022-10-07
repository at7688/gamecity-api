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
export class TelegramBotService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateTelegramBotDto) {
    const { type, chat_id, token } = data;

    const result = await this.prisma.telegramBot.create({
      data: {
        type,
        chat_id,
        token,
      },
    });
    return this.prisma.success();
  }

  async findAll() {
    const result = await this.prisma.telegramBot.findMany();
    return this.prisma.success(result);
  }

  async update(id: number, data: UpdateTelegramBotDto) {
    const { type, chat_id, token } = data;
    const result = await this.prisma.telegramBot.update({
      where: {
        id,
      },
      data: {
        type,
        chat_id,
        token,
      },
    });
    return this.prisma.success();
  }

  async remove(id: number) {
    await this.prisma.telegramBot.delete({ where: { id } });
    return this.prisma.success();
  }
}
