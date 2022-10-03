import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSmsMerchantDto } from './dto/create-sms-merchant.dto';
import { UpdateSmsMerchantDto } from './dto/update-sms-merchant.dto';

@Injectable()
export class SmsMerchantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSmsMerchantDto) {
    const { code, name, config } = data;
    await this.prisma.smsMerchant.create({
      data: {
        code,
        name,
        config: config as unknown as Prisma.InputJsonObject,
      },
    });
    return this.prisma.success();
  }

  async findAll() {
    return this.prisma.success(await this.prisma.smsMerchant.findMany());
  }

  async findOne(code: string) {
    return this.prisma.success(
      await this.prisma.smsMerchant.findUnique({ where: { code } }),
    );
  }

  async update(data: UpdateSmsMerchantDto) {
    const { code, name, config } = data;
    await this.prisma.smsMerchant.update({
      where: {
        code,
      },
      data: {
        name,
        config: config as unknown as Prisma.InputJsonObject,
      },
    });
    return this.prisma.success();
  }

  remove(code: string) {
    return `This action removes a #${code} smsMerchant`;
  }
}
