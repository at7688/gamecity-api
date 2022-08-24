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
import { BankDepositClientService } from './bank-deposit.client.service';
import { CreateBankDepositDto } from './dto/create-bank-deposit.dto';
import { SearchBankDepositsDto } from './dto/search-bank-deposits.dto';
import { UpdateBankDepositDto } from './dto/update-bank-deposit.dto';

@Controller('deposits')
@Platforms([PlatformType.PLAYER])
export class BankDepositClientController {
  constructor(private readonly bankDepositService: BankDepositClientService) {}

  @Post()
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
