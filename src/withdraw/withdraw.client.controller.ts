import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlatformType } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { SearchWithdrawsDto } from './dto/search-withdraws.dto';
import { WithdrawClientService } from './withdraw.client.service';

@Controller('withdraws')
@Platforms([PlatformType.PLAYER])
export class WithdrawClientController {
  constructor(private readonly bankWithdrawService: WithdrawClientService) {}

  @Post()
  create(@Body() createWithdrawDto: CreateWithdrawDto) {
    return this.bankWithdrawService.create(createWithdrawDto);
  }

  @Get()
  findAll(@Query() query: SearchWithdrawsDto) {
    return this.bankWithdrawService.findAll(query);
  }
}
