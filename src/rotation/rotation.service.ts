import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';

@Injectable()
export class RotationService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateRotationDto) {
    return this.prisma.rotationGroup.create({ data });
  }

  async options(type: number) {
    return this.prisma.rotationGroup.findMany({
      where: { type },
      select: { id: true, name: true, sort: true },
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    });
  }
  async findAll(type: number) {
    const findManyArg: Prisma.RotationGroupFindManyArgs = {
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
    };
    return this.prisma.listFormat({
      items: await this.prisma.rotationGroup.findMany(findManyArg),
      count: await this.prisma.rotationGroup.count({
        where: findManyArg.where,
      }),
    });
  }
  findOne(id: number) {
    return `This action returns a #${id} rotation`;
  }

  update(id: number, data: UpdateRotationDto) {
    return this.prisma.rotationGroup.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.rotationGroup.delete({
      where: { id },
    });
  }
}
