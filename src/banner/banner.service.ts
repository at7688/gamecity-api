import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateBannerDto) {
    return this.prisma.banner.create({ data });
  }

  findAll() {
    return this.prisma.banner.findMany();
  }

  findOne(id: string) {
    return this.prisma.banner.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateBannerDto) {
    return this.prisma.banner.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.banner.delete({ where: { id } });
  }
}
