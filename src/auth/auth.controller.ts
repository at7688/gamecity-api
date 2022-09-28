import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlatformType, Player } from '@prisma/client';
import { Request } from 'express';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { Public } from 'src/metas/public.meta';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  platform = this.configService.get('PLATFORM');

  @Post('login')
  @Public()
  async login(@Body() body: LoginDto, @Req() req: Request) {
    switch (this.platform) {
      case PlatformType.ADMIN:
        return this.authService.adminUserLogin(body, req.ip);
      case PlatformType.AGENT:
        return this.authService.agentLogin(body, req.ip);
      case PlatformType.PLAYER:
        return this.authService.playerLogin(body, req.ip);

      default:
        break;
    }
  }

  @Post('logout')
  @Public()
  async logout(@Req() req) {
    return this.prisma.success();
  }

  @Get('me')
  @Platforms([PlatformType.ADMIN, PlatformType.AGENT, PlatformType.PLAYER])
  async getAdminInfo(@User() user: LoginUser | Player) {
    if ('vip_id' in user) {
      return this.authService.getPlayerInfo(user);
    } else if ('admin_role_id' in user) {
      return this.authService.getAdminInfo(user);
    } else {
      return this.authService.getAgentInfo(user);
    }
  }
}
