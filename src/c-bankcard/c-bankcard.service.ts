import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCBankcardDto } from './dto/create-c-bankcard.dto';
import { SearchCBankcardDto } from './dto/search-c-bankcard.dto';
import { UpdateCBankcardDto } from './dto/update-c-bankcard.dto';
import { companyCardList } from './raw/companyCardList';

@Injectable()
export class CBankcardService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateCBankcardDto) {
    await this.prisma.companyCard.create({
      data,
    });
    return this.prisma.success();
  }

  async findAll(search: SearchCBankcardDto) {
    const { rotation_id } = search;
    const result = await this.prisma.$queryRaw(companyCardList(rotation_id));
    return this.prisma.success(result);
  }

  async findOne(id: string) {
    const result = await this.prisma.companyCard.findUnique({ where: { id } });
    return this.prisma.success(result);
  }

  async update(id: string, data: UpdateCBankcardDto) {
    await this.prisma.companyCard.update({ where: { id }, data });
    return this.prisma.success();
  }

  async remove(id: string) {
    await this.prisma.companyCard.delete({ where: { id } });
    return this.prisma.success();
  }
}
