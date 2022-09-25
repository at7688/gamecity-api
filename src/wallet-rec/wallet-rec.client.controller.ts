import { Controller, Get } from '@nestjs/common';
import { PlatformType, Player } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { WalletRecClientService } from './wallet-rec.client.service';

@Controller('client/wallet-records')
@Platforms([PlatformType.PLAYER])
export class WalletRecClientController {
  constructor(private readonly walletRecService: WalletRecClientService) {}

  @Get()
  findAll(@User() player: Player) {
    return this.walletRecService.findAll(player);
  }
}
