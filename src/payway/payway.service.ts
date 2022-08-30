import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaywayDto } from './dto/create-payway.dto';
import { UpdatePaywayDto } from './dto/update-payway.dto';

@Injectable()
export class PaywayService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPaywayDto: CreatePaywayDto) {
    return 'This action adds a new payway';
  }

  findAll() {
    return this.prisma.payway.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} payway`;
  }

  update(id: number, updatePaywayDto: UpdatePaywayDto) {
    return `This action updates a #${id} payway`;
  }

  remove(id: number) {
    return `This action removes a #${id} payway`;
  }
}
