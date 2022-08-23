import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { CreateBankDepositRecDto } from './dto/create-bank-deposit-rec.dto';
import { SearchBankDepositRecsDto } from './dto/search-bank-deposit-recs.dto';
import { UpdateBankDepositRecDto } from './dto/update-bank-deposit-rec.dto';

@Injectable()
export class BankDepositRecService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateBankDepositRecDto) {
    return this.prisma.bankDepositRec.create({
      data,
    });
  }

  findAll(search: SearchBankDepositRecsDto, user: LoginUser) {
    const {
      nickname,
      username,
      account,
      name,
      created_start_at,
      created_end_at,
      amount_from,
      amount_to,
    } = search;
    return this.prisma.bankDepositRec.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} bankDepositRec`;
  }

  update(id: string, data: UpdateBankDepositRecDto) {
    const { note, status } = data;
    return this.prisma.bankDepositRec.update({
      where: { id },
      data: { note, status },
    });
  }
  updateAccTail(id: string, acc_tail: string) {
    return this.prisma.bankDepositRec.update({
      where: { id },
      data: { acc_tail },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} bankDepositRec`;
  }
}
