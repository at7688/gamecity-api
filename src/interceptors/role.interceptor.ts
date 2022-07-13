import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminUser, Member, Permission } from '@prisma/client';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY, IS_ROLE_PUBLIC_KEY } from 'src/meta-consts';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    // console.log(req);
    const controller = context.getClass();
    const handler = context.getHandler();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isRolePublic = this.reflector.getAllAndOverride<boolean>(
      IS_ROLE_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic || isRolePublic) {
      return next.handle();
    }

    if (req.user.admin_role?.code === 'MASTER') {
      return next.handle();
    }

    const role_code = req.user.agent ? 'AGENT' : req.user.admin_role?.code;

    const permissions = await this.prisma.permission.findMany({
      where: {
        menus: {
          some: {
            admin_roles: {
              some: {
                code: role_code,
              },
            },
          },
        },
      },
    });

    const i = permissions.findIndex(
      (t) => t.controller === controller.name && t.handler === handler.name,
    );

    if (i > -1) {
      return next.handle();
    }

    throw new ForbiddenException('無操作權限');
  }
}
