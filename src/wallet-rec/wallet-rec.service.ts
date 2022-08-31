import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletRecService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.walletRec.findMany();
  }
}
