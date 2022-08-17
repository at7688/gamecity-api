import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePBankcardDto } from './dto/create-p-bankcard.dto';
import { UpdatePBankcardDto } from './dto/update-p-bankcard.dto';

@Injectable()
export class PBankcardService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPBankcardDto: CreatePBankcardDto) {
    return 'This action adds a new pBankcard';
  }

  findAll() {
    return `This action returns all pBankcard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pBankcard`;
  }

  update(id: number, updatePBankcardDto: UpdatePBankcardDto) {
    return `This action updates a #${id} pBankcard`;
  }

  remove(id: number) {
    return `This action removes a #${id} pBankcard`;
  }
}
