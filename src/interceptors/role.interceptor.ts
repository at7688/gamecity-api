import {
  CACHE_MANAGER,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '@prisma/client';
import { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { IS_GLOBAL, IS_PUBLIC } from 'src/meta-consts';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const controller = context.getClass();
    const handler = context.getHandler();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isGlobal = this.reflector.getAllAndOverride<boolean>(IS_GLOBAL, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || isGlobal) {
      return next.handle();
    }

    // 可移除,即吃設定的選單權限
    if (req.user.admin_role?.code === 'MASTER') {
      return next.handle();
    }

    const permissions = await this.cacheManager.get<Permission[]>(req.user.id);

    const i = permissions?.findIndex(
      (t) => t.controller === controller.name && t.handler === handler.name,
    );

    if (i > -1) {
      return next.handle();
    }

    throw new ForbiddenException(
      `無操作權限 (${controller.name}/${handler.name})`,
    );
  }
}
