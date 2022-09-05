import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminUser } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { ManualOperationDto } from './dto/manual-operation.dto';
import { WalletRecService } from './wallet-rec.service';

@Controller('wallet-records')
export class WalletRecController {
  constructor(private readonly walletRecService: WalletRecService) {}

  @Get()
  findAll() {
    return this.walletRecService.findAll();
  }

  @Post('manual')
  manualOperation(@Body() data: ManualOperationDto, @User() user: AdminUser) {
    return this.walletRecService.manualOperation(data, user);
  }
}
