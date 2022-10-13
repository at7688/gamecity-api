import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { pagerList } from 'src/sql/pagerList';
import { ActivePaymentToolDto } from './dto/active-payment-tool.dto';
import { CreatePaymentToolDto } from './dto/create-payment-tool.dto';
import { CurrentPaymentToolDto } from './dto/current-payment-tool.dto';
import { SearchPaymentToolsDto } from './dto/search-payment-tools.dto';
import { UpdatePaymentToolDto } from './dto/update-payment-tool.dto';
import { getToolList } from './raw/getToolList';

@Injectable()
export class PaymentToolService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreatePaymentToolDto) {
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
    await this.prisma.paymentTool.create({
      data: {
        tool_name,
        is_active,
        recharge_max,
        note,
        rotation_id,
        merchant_id,
        sort: sort || undefined,
        payways: {
          createMany: {
            data: payways.map((t) => ({ ...t, merchant_id })),
          },
        },
        merchant_config,
        is_current: false,
      },
      include: {
        payways: true,
      },
    });
    return this.prisma.success();
  }

  async findAll(search: SearchPaymentToolsDto) {
    const {
      rotation_id,
      tool_name,
      merchant_id,
      merchant_no,
      is_active,
      page,
      perpage,
    } = search;

    const records = await this.prisma.$queryRaw(
      pagerList(getToolList(search), page, perpage),
    );

    return this.prisma.listFormat({ ...records[0], search });
  }

  async findOne(id: string) {
    const result = await this.prisma.paymentTool.findUnique({
      where: { id },
      include: { payways: true },
    });
    return this.prisma.success(result);
  }

  async active({ id, is_active }: ActivePaymentToolDto) {
    await this.prisma.paymentTool.update({
      where: { id },
      data: {
        is_active,
      },
    });
    return this.prisma.success();
  }

  async clean(id: string) {
    await this.prisma.paymentTool.update({
      where: { id },
      data: {
        accumulate_from: new Date(),
      },
    });
    return this.prisma.success();
  }

  async update(id: string, data: UpdatePaymentToolDto) {
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
    await this.prisma.paymentTool.update({
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
          updateMany: payways.map(({ code, ...data }) => ({
            where: { code },
            data,
          })),
        },
        merchant_config,
      },
      include: {
        payways: true,
      },
    });
    return this.prisma.success();
  }

  async current({ id, is_current }: CurrentPaymentToolDto) {
    await this.prisma.paymentTool.update({
      where: { id },
      data: { is_current },
    });

    return this.prisma.success();
  }

  remove(id: string) {
    return this.prisma.paymentTool.delete({ where: { id } });
  }
}
