import { SearchBankDepositRecsDto } from './dto/search-bank-deposit-recs.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BankDepositRecService } from './bank-deposit-rec.service';
import { CreateBankDepositRecDto } from './dto/create-bank-deposit-rec.dto';
import { UpdateBankDepositRecDto } from './dto/update-bank-deposit-rec.dto';
import { User } from 'src/decorators/user.decorator';
import { LoginUser } from 'src/types';

@Controller('bank-deposit-recs')
export class BankDepositRecController {
  constructor(private readonly bankDepositRecService: BankDepositRecService) {}

  @Post()
  create(@Body() createBankDepositRecDto: CreateBankDepositRecDto) {
    return this.bankDepositRecService.create(createBankDepositRecDto);
  }

  @Get()
  findAll(@Query() query: SearchBankDepositRecsDto, @User() user: LoginUser) {
    return this.bankDepositRecService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankDepositRecService.findOne(id);
  }

  @Patch(':id/tail')
  updateAccTail(@Param('id') id: string, @Body('acc_tail') acc_tail: string) {
    return this.bankDepositRecService.updateAccTail(id, acc_tail);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateBankDepositRecDto) {
    return this.bankDepositRecService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankDepositRecService.remove(id);
  }
}
