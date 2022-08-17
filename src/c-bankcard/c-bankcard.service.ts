import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCBankcardDto } from './dto/create-c-bankcard.dto';
import { UpdateCBankcardDto } from './dto/update-c-bankcard.dto';

@Injectable()
export class CBankcardService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateCBankcardDto) {
    return this.prisma.companyCard.create({
      data,
    });
  }

  async findAll() {
    const findManyArg: Prisma.CompanyCardFindManyArgs = {};
    return this.prisma.listFormat({
      items: await this.prisma.companyCard.findMany(findManyArg),
      count: await this.prisma.companyCard.count({ where: findManyArg.where }),
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} cBankcard`;
  }

  update(id: string, updateCBankcardDto: UpdateCBankcardDto) {
    return `This action updates a #${id} cBankcard`;
  }

  remove(id: string) {
    return `This action removes a #${id} cBankcard`;
  }
}
