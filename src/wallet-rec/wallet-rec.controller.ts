import { Controller, Get } from '@nestjs/common';
import { WalletRecService } from './wallet-rec.service';

@Controller('wallet-records')
export class WalletRecController {
  constructor(private readonly walletRecService: WalletRecService) {}

  @Get()
  findAll() {
    return this.walletRecService.findAll();
  }
}
