import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/meta-consts';
import { AuthTokenService } from 'src/user/auth_token.service';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly tokenService: AuthTokenService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      const authToken = await this.tokenService.findOne({ token });
      if (authToken) {
        return super.canActivate(context) as Promise<boolean>;
      }
    }
    return false;
  }
}
