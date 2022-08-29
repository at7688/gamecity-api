import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentToolDto } from './dto/create-payment-tool.dto';
import { UpdatePaymentToolDto } from './dto/update-payment-tool.dto';

@Injectable()
export class PaymentToolService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreatePaymentToolDto) {
    const {
      tool_name,
      is_active,
      recharge_max,
      note,
      rotation_id,
      merchant_id,
      sort,
      payways,
      merchant_config,
    } = data;
    return this.prisma.paymentTool.create({
      data: {
        tool_name,
        is_active,
        recharge_max,
        note,
        rotation_id,
        merchant_id,
        sort,
        payways: {
          createMany: {
            data: payways,
          },
        },
        merchant_config,
        is_current: false,
      },
      include: {
        payways: true,
      },
    });
  }

  findAll() {
    return this.prisma.paymentTool.findMany({ include: { payways: true } });
  }

  findOne(id: string) {
    return this.prisma.paymentTool.findUnique({
      where: { id },
      include: { payways: true },
    });
  }

  update(id: string, data: UpdatePaymentToolDto) {
    const {
      tool_name,
      is_active,
      recharge_max,
      note,
      rotation_id,
      merchant_id,
      sort,
      payways,
      merchant_config,
    } = data;
    return this.prisma.paymentTool.update({
      where: { id },
      data: {
        tool_name,
        is_active,
        recharge_max,
        note,
        rotation_id,
        merchant_id,
        sort,
        payways: {
          updateMany: payways.map(({ id, ...data }) => ({
            where: { id },
            data,
          })),
        },
        merchant_config,
        is_current: false,
      },
      include: {
        payways: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.paymentTool.delete({ where: { id } });
  }
}
