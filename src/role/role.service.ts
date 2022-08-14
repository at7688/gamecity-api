import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}
  create({ menu_ids, ...data }: CreateRoleDto) {
    return this.prisma.adminRole.create({
      data: {
        ...data,
        menu: {
          connect: menu_ids.map((per_id) => ({ id: per_id })),
        },
      },
      include: {
        menu: true,
      },
    });
  }

  async findAll() {
    const findManyArgs: Prisma.AdminRoleFindManyArgs = {
      include: {
        menu: true,
      },
    };
    return this.prisma.listFormat({
      items: await this.prisma.adminRole.findMany(findManyArgs),
      count: await this.prisma.adminRole.count({ where: findManyArgs.where }),
    });
  }

  findOne(id: string) {
    return this.prisma.adminRole.findUnique({
      where: { id },
      include: {
        menu: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  update(id: string, { menu_ids, ...data }: UpdateRoleDto) {
    return this.prisma.adminRole.update({
      where: { id },
      data: {
        ...data,
        menu: {
          set: menu_ids.map((per_id) => ({ id: per_id })),
        },
      },
      include: { menu: true },
    });
  }

  remove(id: string) {
    return this.prisma.adminRole.delete({ where: { id } });
  }
}
