import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppService } from 'src/app.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ menu_ids, ...data }: CreateRoleDto) {
    await this.prisma.adminRole.create({
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
    return this.prisma.success();
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

  async findOne(id: string) {
    const result = await this.prisma.adminRole.findUnique({
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
    return this.prisma.success(result);
  }

  async update(id: string, { menu_ids, ...data }: UpdateRoleDto) {
    await this.prisma.adminRole.update({
      where: { id },
      data: {
        ...data,
        menu: {
          set: menu_ids.map((per_id) => ({ id: per_id })),
        },
      },
      include: { menu: true },
    });

    return this.prisma.success();
  }

  async remove(id: string) {
    await this.prisma.adminRole.delete({ where: { id } });
    return this.prisma.success();
  }
}
