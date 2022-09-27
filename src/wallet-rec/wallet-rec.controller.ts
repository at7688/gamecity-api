import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminUser } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { ManualOperationDto } from './dto/manual-operation.dto';
import { SearchWalletRecDto } from './dto/search-wallet-rec.dto';
import { WalletRecService } from './wallet-rec.service';

@Controller('wallet-record')
export class WalletRecController {
  constructor(private readonly walletRecService: WalletRecService) {}

  @Post('list')
  findAll(@Body() search: SearchWalletRecDto) {
    return this.walletRecService.findAll(search);
  }

  @Post('manual')
  manualOperation(@Body() data: ManualOperationDto, @User() user: AdminUser) {
    return this.walletRecService.manualOperation(data, user);
  }
}
