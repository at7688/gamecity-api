import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BankService {
  constructor(private readonly prisma: PrismaService) {}

  async options() {
    const result = await this.prisma.bank.findMany({
      where: { is_active: true },
    });
    return this.prisma.success(result);
  }
}
