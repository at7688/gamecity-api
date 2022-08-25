import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PlatformType } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { LoginUser } from 'src/types';
import { WithdrawClientService } from './withdraw.client.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { SearchWithdrawsDto } from './dto/search-withdraws.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankWithdrawService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWithdrawDto: UpdateWithdrawDto,
  ) {
    return this.bankWithdrawService.update(id, updateWithdrawDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankWithdrawService.remove(id);
  }
}
