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
    const controller = context.getClass();
    const handler = context.getHandler();

    const isRolePublic = this.reflector.getAllAndOverride<boolean>(
      IS_ROLE_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (req.user && !isRolePublic) {
      if (req.user.admin_role.code === 'MASTER') {
        return next.handle();
      }
      const role_id = req.user.admin_role.id as string;
      const permissions = await this.prisma.permission.findMany({
        where: {
          admin_role: { some: { id: role_id } },
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
