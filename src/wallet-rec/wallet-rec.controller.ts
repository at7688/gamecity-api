import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminUser } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { LoginUser } from 'src/types';
import { ManualOperationDto } from './dto/manual-operation.dto';
import { SearchWalletRecDto } from './dto/search-wallet-rec.dto';
import { WalletRecService } from './wallet-rec.service';

@Controller('wallet-record')
export class WalletRecController {
  constructor(private readonly walletRecService: WalletRecService) {}

  @Post('list')
  @Platforms(['AGENT'])
  findAll(@Body() search: SearchWalletRecDto, @User() user: LoginUser) {
    if ('admin_role_id' in user) {
      return this.walletRecService.findAll(search);
    }
    return this.walletRecService.findAll(search, user);
  }

  @Post('manual')
  manualOperation(@Body() data: ManualOperationDto, @User() user: AdminUser) {
    return this.walletRecService.manualOperation(data, user);
  }
}
