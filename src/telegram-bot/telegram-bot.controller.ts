import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { CreateTelegramBotDto } from './dto/create-telegram-bot.dto';
import { UpdateTelegramBotDto } from './dto/update-telegram-bot.dto';

@Controller('telegram-bot')
export class TelegramBotController {
  constructor(private readonly telegramBotService: TelegramBotService) {}

  @Post()
  create(@Body() createTelegramBotDto: CreateTelegramBotDto) {
    return this.telegramBotService.create(createTelegramBotDto);
  }

  @Get()
  findAll() {
    return this.telegramBotService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTelegramBotDto: UpdateTelegramBotDto,
  ) {
    return this.telegramBotService.update(id, updateTelegramBotDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.telegramBotService.remove(id);
  }
}
