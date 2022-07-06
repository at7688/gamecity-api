import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { Serilizer } from 'src/interceptors/serializer.interceptor';
import { RolePublic } from 'src/role/metas/role-public.meta';
import { AuthService } from './auth.service';
import { AuthTokenService } from './auth_token.service';
import { User } from './decorators/user.decorator';
import { SigninDto } from './dto/signin.dto';
import { UserDto } from './dto/user.dto';
import { Public } from './metas/public.meta';

@Controller('auth')
@Serilizer(UserDto)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: AuthTokenService,
  ) {}

  @Get('me')
  @RolePublic()
  async me(@User() user) {
    return user;
  }

  @Public()
  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signout')
  async signout(@Headers() headers) {
    if (headers.authorization) {
      const token = headers.authorization.replace('Bearer ', '');
      const authToken = await this.tokenService.remove({ token });
      return { success: true, user_id: authToken.user_id };
    }
  }
}
