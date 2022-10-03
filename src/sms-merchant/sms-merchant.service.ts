import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Player, Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSmsMerchantDto } from './dto/create-sms-merchant.dto';
import { UpdateSmsMerchantDto } from './dto/update-sms-merchant.dto';
import { Every8dService } from './every8d/every8d.service';

@Injectable()
export class SmsMerchantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly every8d: Every8dService,
  ) {}

  merchantMap = {
    every8d: this.every8d,
  };

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

  getCredit(merchant: string) {
    return this.every8d.getCredit();
  }

  async sendSms(content: string, phones: string[]) {
    const config = await this.prisma.sysConfig.findUnique({
      where: { code: 'SMS_MERCHANT' },
    });

    if (!config) {
      this.prisma.error(ResCode.NOT_FOUND);
    }

    await this.merchantMap[config.value].sendSms(content, phones);
  }
}
