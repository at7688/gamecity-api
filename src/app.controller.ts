import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './metas/public.meta';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  root() {
    return 'PPAP';
  }
  @Get('testing')
  @Public()
  testing() {
    return this.appService.testing();
  }
}
