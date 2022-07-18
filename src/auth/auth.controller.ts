import { Body, Controller, Post, Request } from '@nestjs/common';
import { Public } from 'src/user/metas/public.meta';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() body: SigninDto) {
    return this.authService.adminUserLogin(body);
  }

  @Post('logout')
  @Public()
  async logout(@Request() req) {
    return { success: true };
  }
}
