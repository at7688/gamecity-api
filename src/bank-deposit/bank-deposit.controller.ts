import { SearchBankDepositsDto } from './dto/search-bank-deposits.dto';
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
import { BankDepositService } from './bank-deposit.service';
import { CreateBankDepositDto } from './dto/create-bank-deposit.dto';
import { UpdateBankDepositDto } from './dto/update-bank-deposit.dto';
import { LoginUser } from 'src/types';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { PlatformType } from '@prisma/client';

@Controller('bank-deposit')
export class BankDepositController {
  constructor(private readonly bankDepositService: BankDepositService) {}

  @Post()
  @Platforms([PlatformType.PLAYER])
  create(@Body() createBankDepositDto: CreateBankDepositDto) {
    return this.bankDepositService.create(createBankDepositDto);
  }

  @Get()
  findAll(@Query() query: SearchBankDepositsDto, @User() user: LoginUser) {
    return this.bankDepositService.findAll(query, user);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankDepositService.remove(id);
  }
}
