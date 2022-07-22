import { SearchLoginRecsDto } from './dto/search-login-rec.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LoginRecService } from './login-rec.service';
import { CreateLoginRecDto } from './dto/create-login-rec.dto';
import { UpdateLoginRecDto } from './dto/update-login-rec.dto';

@Controller('login-recs')
export class LoginRecController {
  constructor(private readonly loginRecService: LoginRecService) {}

  @Post()
  create(@Body() createLoginRecDto: CreateLoginRecDto) {
    return this.loginRecService.create(createLoginRecDto);
  }

  @Get()
  findAll(@Query() query: SearchLoginRecsDto) {
    return this.loginRecService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loginRecService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLoginRecDto: UpdateLoginRecDto,
  ) {
    return this.loginRecService.update(+id, updateLoginRecDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loginRecService.remove(+id);
  }
}
