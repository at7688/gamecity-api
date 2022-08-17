import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVipDto } from './dto/create-vip.dto';
import { UpdateVipDto } from './dto/update-vip.dto';

@Injectable()
export class VipService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateVipDto) {
    return this.prisma.vip.create({
      data,
    });
  }

  async findAll() {
    const findManyArgs: Prisma.VipFindManyArgs = {};
    return this.prisma.listFormat({
      items: await this.prisma.vip.findMany(findManyArgs),
      count: await this.prisma.vip.count({ where: findManyArgs.where }),
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} vip`;
  }

  update(id: string, updateVipDto: UpdateVipDto) {
    return `This action updates a #${id} vip`;
  }

  remove(id: string) {
    return this.prisma.vip.delete({ where: { id } });
  }
}
