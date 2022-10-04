import {
  CACHE_MANAGER,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ResCode } from 'src/errors/enums';
import { IS_PUBLIC } from 'src/meta-consts';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
  ) {
    super();
  }
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization.replace('Bearer ', '');
    const username = await this.cacheManager.get(`token:${token}`);

    if (!username) {
      return false;
    }
    return super.canActivate(ctx) as Promise<boolean>;
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
