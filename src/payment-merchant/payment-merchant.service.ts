import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentMerchantDto } from './dto/create-payment-merchant.dto';
import { UpdatePaymentMerchantDto } from './dto/update-payment-merchant.dto';

@Injectable()
export class PaymentMerchantService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreatePaymentMerchantDto) {
    const { name, code, is_active, fields, pay_types } = data;
    await this.prisma.paymentMerchant.create({
      data: {
        name,
        code,
        is_active,
        config: {
          fields,
          pay_types,
        },
      },
    });

    return this.prisma.success();
  }

  findAll() {
    return this.prisma.paymentMerchant.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        config: true,
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} paymentMerchant`;
  }

  async update(id: string, data: UpdatePaymentMerchantDto) {
    const { name, code, is_active, fields, pay_types } = data;
    await this.prisma.paymentMerchant.update({
      where: { id },
      data: {
        name,
        code,
        is_active,
        config: {
          fields,
          pay_types,
        },
      },
    });

    return this.prisma.success();
  }

  remove(id: string) {
    return `This action removes a #${id} paymentMerchant`;
  }
}
