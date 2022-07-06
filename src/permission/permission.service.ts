import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  batchCreate(list: CreatePermissionDto[]) {
    return this.prisma.permission.createMany({
      data: list,
      skipDuplicates: true,
    });
  }
  create(data: CreatePermissionDto) {
    return this.prisma.permission.create({ data });
  }

  findAll() {
    return this.prisma.permission.findMany();
  }

  findOne(id: string) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  update(id: string, data: UpdatePermissionDto) {
    return this.prisma.permission.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.permission.delete({ where: { id } });
  }
}
