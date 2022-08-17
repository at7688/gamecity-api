import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { Public } from 'src/metas/public.meta';
import { LoginUser } from 'src/types';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  platform = this.configService.get('PLATFORM');

  @Post('login')
  @Public()
  async login(@Body() body: LoginDto) {
    switch (this.platform) {
      case 'ADMIN':
        return this.authService.adminUserLogin(body);
      case 'AGENT':
        return this.authService.agentLogin(body);
      case 'PLAYER':
        return this.authService.playerLogin(body);

      default:
        break;
    }
  }

  @Post('logout')
  @Public()
  async logout(@Request() req) {
    return { success: true };
  }

  @Get('me')
  @Platforms(['ADMIN', 'AGENT'])
  async me(@User() user: LoginUser) {
    return this.authService.getLoginInfo(user);
  }
}
