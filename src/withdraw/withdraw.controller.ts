import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { SearchWithdrawsDto } from './dto/search-withdraws.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';

@Controller('withdraw-records')
export class WithdrawController {
  constructor(private readonly bankWithdrawService: WithdrawService) {}

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
}
