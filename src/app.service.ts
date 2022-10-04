import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async testing() {
    const config = await this.prisma.sysConfig.findUnique({
      where: {
        code: 'REGISTER_REQUIRED',
      },
    });
    return JSON.parse(config.value);
  }
}
