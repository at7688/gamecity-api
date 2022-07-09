import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityPromoDto } from './dto/create-activity-promo.dto';
import { UpdateActivityPromoDto } from './dto/update-activity-promo.dto';

@Injectable()
export class ActivityPromoService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateActivityPromoDto) {
    return this.prisma.activityPromo.create({ data });
  }

  findAll() {
    return this.prisma.activityPromo.findMany();
  }

  findOne(id: string) {
    return this.prisma.activityPromo.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateActivityPromoDto) {
    return this.prisma.activityPromo.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.activityPromo.delete({ where: { id } });
  }
}
