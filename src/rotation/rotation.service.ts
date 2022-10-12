import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';

@Injectable()
export class RotationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRotationDto) {
    await this.prisma.rotationGroup.create({ data });
    return this.prisma.success();
  }

  async options(type: number) {
    const result = await this.prisma.rotationGroup.findMany({
      where: { type },
      select: { id: true, name: true, sort: true },
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    });
    return this.prisma.success(result);
  }
  async findAll(type: number) {
    const result = await this.prisma.rotationGroup.findMany({
      where: {
        type,
      },
      include: {
        _count: {
          select: {
            company_card: true,
          },
        },
        [{ 1: 'card_vip', 2: 'payment_vip' }[type]]: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    });
    return this.prisma.success(result);
  }

  async update(id: number, data: UpdateRotationDto) {
    await this.prisma.rotationGroup.update({
      where: { id },
      data,
    });
    return this.prisma.success();
  }

  async remove(id: number) {
    await this.prisma.rotationGroup.delete({
      where: { id },
    });
    return this.prisma.success();
  }
}
