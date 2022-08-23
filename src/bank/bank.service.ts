import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BankService {
  constructor(private readonly prisma: PrismaService) {}

  options() {
    return this.prisma.bank.findMany({ where: { is_active: true } });
  }
}
