import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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

    if (!isPublic && !isRolePublic && req.session.user) {
      if (req.session.user.admin_role.code === 'MASTER') {
        return next.handle();
      }
      const role_id = req.session.user.admin_role.id as string;
      // const role = await this.prisma.adminRole.findUnique({
      //   where: { id: role_id },
      //   include: {
      //     menu: { include: { permissions: { select: { id: true } } } },
      //   },
      // });

      const permissions = await this.prisma.permission.findMany({
        where: {
          menus: { some: { admin_roles: { some: { id: role_id } } } },
          controller: controller.name,
          handler: handler.name,
        },
      });

      if (!permissions.length) {
        throw new ForbiddenException('無角色權限');
      }
    }

    return next.handle();
  }
}
