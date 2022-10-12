import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BankDepositService } from './bank-deposit.service';
import { SearchBankDepositsDto } from './dto/search-bank-deposits.dto';
import { UpdateBankDepositDto } from './dto/update-bank-deposit.dto';

@Controller('bankDeposit')
export class BankDepositController {
  constructor(private readonly bankDepositService: BankDepositService) {}

  @Post('list')
  findAll(@Body() search: SearchBankDepositsDto) {
    return this.bankDepositService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankDepositService.findOne(id);
  }

  @Post('validate')
  validate(@Body() updateBankDepositDto: UpdateBankDepositDto) {
    return this.bankDepositService.validate(updateBankDepositDto);
  }
}
