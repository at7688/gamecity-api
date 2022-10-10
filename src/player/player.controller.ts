import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { Public } from 'src/metas/public.meta';
import { LoginUser } from 'src/types';
import { ChangePwDto } from './dto/change-pw.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { RegisterPlayerDto } from './dto/register-player.dto';
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

  @Post('list')
  findAll(@Body() search: SearchPlayersDto, @User() user: LoginUser) {
    return this.playerService.findAll(search, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }

  @Patch('password')
  updatePw(@Body() data: ChangePwDto) {
    return this.playerService.updatePw(data);
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
}
