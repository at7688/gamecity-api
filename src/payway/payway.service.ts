import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaywayDto } from './dto/create-payway.dto';
import { UpdatePaywayDto } from './dto/update-payway.dto';

@Injectable()
export class PaywayService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreatePaywayDto) {
    const {
      type,
      merchant_id,
      code,
      name,
      player_fee_amount,
      player_fee_max,
      player_fee_min,
      player_fee_percent,
      fee_amount,
      fee_max,
      fee_min,
      fee_percent,
      deposit_max,
      deposit_min,
    } = data;
    await this.prisma.payway.create({
      data: {
        type,
        merchant_id,
        code,
        name,
        player_fee_amount,
        player_fee_max,
        player_fee_min,
        player_fee_percent,
        fee_amount,
        fee_max,
        fee_min,
        fee_percent,
        deposit_max,
        deposit_min,
      },
    });
    return this.prisma.success();
  }

  async findAll() {
    const result = await this.prisma.payway.findMany();
    return this.prisma.success(result);
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
