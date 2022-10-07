import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BankDepositService } from './bank-deposit.service';
import { SearchBankDepositsDto } from './dto/search-bank-deposits.dto';
import { UpdateBankDepositDto } from './dto/update-bank-deposit.dto';

@Controller('bank-deposit')
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBankDepositDto: UpdateBankDepositDto,
  ) {
    return this.bankDepositService.update(id, updateBankDepositDto);
  }
}
