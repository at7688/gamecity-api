import { RegisterPlayerDto } from './dto/register-player.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { Public } from 'src/metas/public.meta';
import { LoginUser } from 'src/types';
import { CreatePlayerDto } from './dto/create-player.dto';
import { SearchPlayersDto } from './dto/search-players.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('register')
  @Public()
  register(@Body() data: RegisterPlayerDto) {
    return this.playerService.register(data);
  }

  @Post('create')
  create(@Body() createPlayerDto: CreatePlayerDto, @User() user: LoginUser) {
    return this.playerService.create(createPlayerDto, user);
  }

  @Post('validate/:username')
  @Public()
  validate(@Param('username') username: string) {
    return this.playerService.validate(username);
  }

  @Get()
  findAll(@Query() query: SearchPlayersDto, @User() user: LoginUser) {
    return this.playerService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }

  @Patch(':id/password')
  updatePw(@Param('id') id: string, @Body('password') password: string) {
    return this.playerService.updatePw(id, password);
  }
  @Patch(':id/blocked')
  updateBlocked(
    @Param('id') id: string,
    @Body('is_blocked') is_blocked: boolean,
  ) {
    return this.playerService.updateBlocked(id, is_blocked);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerService.remove(id);
  }
}
