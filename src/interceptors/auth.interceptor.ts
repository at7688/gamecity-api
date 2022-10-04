import {
  CACHE_MANAGER,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Permission, PlatformType } from '@prisma/client';
import { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { ResCode } from 'src/errors/enums';
import { IS_PUBLIC, PLATFORMS } from 'src/meta-consts';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return next.handle();
    }

    const token = req.headers.authorization.replace('Bearer ', '');
    console.log(req.user);
    const tokens = await this.cacheManager.get<string[]>(
      `token:${req.user.username}`,
    );

    if (tokens.includes(token)) {
      return next.handle();
    }

    throw new ForbiddenException({
      code: ResCode.NO_AUTH,
      msg: `Token過期`,
    });
  }
}
