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
      select: { id: true, name: true },
    });
  }
  async findAll() {
    const findManyArg: Prisma.RotationGroupFindManyArgs = {};
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

  update(id: number, updateRotationDto: UpdateRotationDto) {
    return `This action updates a #${id} rotation`;
  }

  remove(id: number) {
    return `This action removes a #${id} rotation`;
  }
}
