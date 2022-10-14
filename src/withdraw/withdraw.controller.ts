import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { SearchWithdrawsDto } from './dto/search-withdraws.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly bankWithdrawService: WithdrawService) {}

  @Post('list')
  findAll(@Body() search: SearchWithdrawsDto) {
    return this.bankWithdrawService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankWithdrawService.findOne(id);
  }

  @Post('validate')
  validate(@Body() updateWithdrawDto: UpdateWithdrawDto) {
    return this.bankWithdrawService.validate(updateWithdrawDto);
  }
}
