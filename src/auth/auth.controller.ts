import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/decorators/user.decorator';
import { Global } from 'src/metas/global.meta';
import { Public } from 'src/metas/public.meta';
import { LoginUser } from 'src/types';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  isAdmin = this.configService.get('SITE_TYPE') === 'ADMIN';

  @Post('login')
  @Public()
  async login(@Body() body: SigninDto) {
    if (this.isAdmin) {
      return this.authService.adminUserLogin(body);
    }
    return this.authService.agentLogin(body);
  }

  @Post('logout')
  @Public()
  async logout(@Request() req) {
    return { success: true };
  }

  @Get('me')
  @Global()
  async me(@User() user: LoginUser) {
    return this.authService.getLoginInfo(user);
  }
}
