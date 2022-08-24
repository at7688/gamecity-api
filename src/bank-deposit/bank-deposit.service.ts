import { SearchBankDepositsDto } from './dto/search-bank-deposits.dto';
import { Injectable } from '@nestjs/common';
import { CreateBankDepositDto } from './dto/create-bank-deposit.dto';
import { UpdateBankDepositDto } from './dto/update-bank-deposit.dto';
import { LoginUser } from 'src/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BankDepositService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBankDepositDto: CreateBankDepositDto) {
    return 'This action adds a new bankDeposit';
  }

  findAll(search: SearchBankDepositsDto, user: LoginUser) {
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
    return `This action returns a #${id} bankDeposit`;
  }

  update(id: string, data: UpdateBankDepositDto) {
    const { inner_note, outter_note, status } = data;
    return this.prisma.bankDepositRec.update({
      where: { id },
      data: { inner_note, outter_note, status },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} bankDeposit`;
  }
}
