import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AdminUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.session.user;
  },
);
