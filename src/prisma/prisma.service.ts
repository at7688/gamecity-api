import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { ResCode } from 'src/errors/enums';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  listFormat<T, R extends object, E extends object>({
    items,
    count,
    search,
    extra,
  }: {
    items: T[];
    count: number;
    search?: R;
    extra?: E;
  }) {
    return { items, count, search, ...extra };
  }

  resHandler({
    code,
    msg = '',
    data = null,
  }: {
    code: ResCode;
    msg?: string;
    data?: any;
  }) {
    if (code === ResCode.SUCCESS) {
      return { code, msg, data };
    }
    throw new BadRequestException({ code, msg });
  }
}
