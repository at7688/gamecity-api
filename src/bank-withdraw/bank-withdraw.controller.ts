import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankWithdrawService } from './bank-withdraw.service';
import { CreateBankWithdrawDto } from './dto/create-bank-withdraw.dto';
import { UpdateBankWithdrawDto } from './dto/update-bank-withdraw.dto';

@Controller('bank-withdraw')
export class BankWithdrawController {
  constructor(private readonly bankWithdrawService: BankWithdrawService) {}

  @Post()
  create(@Body() createBankWithdrawDto: CreateBankWithdrawDto) {
    return this.bankWithdrawService.create(createBankWithdrawDto);
  }

  @Get()
  findAll() {
    return this.bankWithdrawService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankWithdrawService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankWithdrawDto: UpdateBankWithdrawDto) {
    return this.bankWithdrawService.update(+id, updateBankWithdrawDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankWithdrawService.remove(+id);
  }
}
