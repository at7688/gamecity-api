import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVipDto } from './dto/create-vip.dto';
import { UpdateVipDto } from './dto/update-vip.dto';
import { vipList } from './raw/vipList';

@Injectable()
export class VipService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateVipDto) {
    return this.prisma.vip.create({
      data,
    });
  }

  async findAll() {
    const records = await this.prisma.$queryRaw(vipList());
    return this.prisma.listFormat(records[0]);
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
