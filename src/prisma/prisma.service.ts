import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

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
}
