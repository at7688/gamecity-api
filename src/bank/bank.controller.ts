import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { BankService } from './bank.service';

@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}
  @Public()
  @Get()
  options() {
    return this.bankService.options();
  }
}
