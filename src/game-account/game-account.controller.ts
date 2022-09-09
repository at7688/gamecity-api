import { Controller } from '@nestjs/common';
import { GameAccountService } from './game-account.service';

@Controller('game-account')
export class GameAccountController {
  constructor(private readonly gameAccountService: GameAccountService) {}
}
