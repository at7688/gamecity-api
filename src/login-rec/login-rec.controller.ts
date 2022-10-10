import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchLoginRecsDto } from './dto/search-login-rec.dto';
import { LoginRecService } from './login-rec.service';

@Controller('loginRec')
export class LoginRecController {
  constructor(private readonly loginRecService: LoginRecService) {}

  @Get('list')
  findAll(@Query() query: SearchLoginRecsDto) {
    return this.loginRecService.findAll(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.loginRecService.findOne(+id);
  // }
}
