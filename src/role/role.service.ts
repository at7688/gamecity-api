import { Injectable } from '@nestjs/common';
import { Prisma, AdminRole, Permission } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: Prisma.AdminRoleCreateInput) {
    return this.prisma.adminRole.create({
      data,
      include: { permissions: true },
    });
  }

  findAll() {
    return this.prisma.adminRole.findMany();
  }

  findOne(id: string) {
    return this.prisma.adminRole.findUnique({
      where: { id },
      include: {
        permissions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  update(id: string, data: Prisma.AdminRoleUpdateInput) {
    return this.prisma.adminRole.update({
      where: { id },
      data,
      include: { permissions: true },
    });
  }

  remove(id: string) {
    return this.prisma.adminRole.delete({ where: { id } });
  }
}
