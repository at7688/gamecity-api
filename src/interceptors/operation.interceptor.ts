import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AdminUser, Member } from '@prisma/client';
import { map, Observable } from 'rxjs';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { OperationRecService } from '../operation-rec/operation-rec.service';

@Injectable()
export class OperationInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private operationRecService: OperationRecService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const reqClass = context.getClass();
    const reqHandler = context.getHandler();
    const [req, res] = context.getArgs();
    return next.handle().pipe(
      map(async (data) => {
        const user: AdminUser | Member = req.user;

        if (user && 'admin_role_id' in user && req.method !== 'GET') {
          if (req.body.password) {
            req.body.password = '***';
          }
          try {
            await this.operationRecService.create({
              controller: reqClass.name,
              handler: reqHandler.name,
              operator: { connect: { id: user.id } },
              reqBody: req.body,
              target_id: req.params.id,
              path: req.path,
              method: req.method,
            });
          } catch (err) {
            console.log(err);
            this.prisma.error(ResCode.DB_ERR, '紀錄寫入錯誤');
          }
        }

        return data;
      }),
    );
  }
}
