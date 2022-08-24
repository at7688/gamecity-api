import { Injectable } from '@nestjs/common';
import { CreateBankWithdrawDto } from './dto/create-bank-withdraw.dto';
import { UpdateBankWithdrawDto } from './dto/update-bank-withdraw.dto';

@Injectable()
export class BankWithdrawService {
  create(createBankWithdrawDto: CreateBankWithdrawDto) {
    return 'This action adds a new bankWithdraw';
  }

  findAll() {
    return `This action returns all bankWithdraw`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bankWithdraw`;
  }

  update(id: number, updateBankWithdrawDto: UpdateBankWithdrawDto) {
    return `This action updates a #${id} bankWithdraw`;
  }

  remove(id: number) {
    return `This action removes a #${id} bankWithdraw`;
  }
}
