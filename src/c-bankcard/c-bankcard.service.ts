import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCBankcardDto } from './dto/create-c-bankcard.dto';
import { UpdateCBankcardDto } from './dto/update-c-bankcard.dto';
import { companyCardList } from './raw/companyCardList';

@Injectable()
export class CBankcardService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateCBankcardDto) {
    return this.prisma.companyCard.create({
      data,
    });
  }

  async findAll(rotation_id: number) {
    const records = await this.prisma.$queryRaw(companyCardList(rotation_id));
    return this.prisma.listFormat(records[0]);
  }

  findOne(id: string) {
    return this.prisma.companyCard.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateCBankcardDto) {
    return this.prisma.companyCard.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.companyCard.delete({ where: { id } });
  }
}
