import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentMerchantDto } from './dto/create-payment-merchant.dto';
import { UpdatePaymentMerchantDto } from './dto/update-payment-merchant.dto';

@Injectable()
export class PaymentMerchantService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreatePaymentMerchantDto) {
    const { name, code, is_active, fields } = data;
    await this.prisma.paymentMerchant.create({
      data: {
        name,
        code,
        is_active,
        fields: {
          createMany: {
            data: fields,
          },
        },
      },
    });

    return { success: true };
  }

  findAll() {
    return this.prisma.paymentMerchant.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        fields: { select: { name: true, code: true } },
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} paymentMerchant`;
  }

  async update(id: string, data: UpdatePaymentMerchantDto) {
    const { name, code, is_active, fields } = data;
    await this.prisma.paymentMerchant.update({
      where: { id },
      data: {
        name,
        code,
        is_active,
        fields: {
          createMany: {
            data: fields,
          },
        },
      },
    });

    return { success: true };
  }

  remove(id: string) {
    return `This action removes a #${id} paymentMerchant`;
  }
}
