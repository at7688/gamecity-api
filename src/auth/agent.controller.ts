import { Body, Controller, Post, Request, Session } from '@nestjs/common';
import { Public } from 'src/user/metas/public.meta';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() body: SigninDto) {
    return this.authService.agentValidate(body);
  }

  @Post('logout')
  async logout(@Request() req) {
    return { success: true };
  }
}
