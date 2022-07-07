import {
  Body,
  Controller,
  Post,
  Request,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/user/metas/public.meta';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @Public()
  async login(@Body() body, @Session() session) {
    session.user = await this.authService.validate(body);
    return session.user;
  }

  @Post('logout')
  async logout(@Request() req) {
    req.session.user = null;
    return { success: true };
  }
}
