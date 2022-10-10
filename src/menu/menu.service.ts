import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ permission_ids, ...data }: CreateMenuDto) {
    await this.prisma.menu.create({
      data: {
        ...data,
        permissions: {
          connect: permission_ids.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });
    return this.prisma.success();
  }

  async pathGetSubMenus(path: string, user: LoginUser) {
    const roleCode = 'admin_role_id' in user ? user.admin_role.code : 'AGENT';
    const result = await this.prisma.menu.findUnique({
      where: {
        path,
      },
      include: {
        sub_menus: {
          where: {
            admin_roles: {
              some: {
                code: roleCode,
              },
            },
          },
        },
        root_menu: true,
      },
    });
    return this.prisma.success(result);
  }

  async findAll() {
    const result = await this.prisma.menu.findMany({
      where: {
        root_menu: null,
      },
      include: {
        sub_menus: {
          include: {
            sub_menus: {
              orderBy: {
                sort: 'asc',
              },
            },
          },
          orderBy: {
            sort: 'asc',
          },
        },
      },
      orderBy: {
        sort: 'asc',
      },
    });

    return this.prisma.success(result);
  }

  async findOne(id: string) {
    const result = await this.prisma.menu.findUnique({ where: { id } });
    return this.prisma.success(result);
  }

  async update(id: string, { permission_ids, ...data }: UpdateMenuDto) {
    await this.prisma.menu.update({
      where: { id },
      data: {
        ...data,
        permissions: {
          set: permission_ids.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });
    return this.prisma.success();
  }

  async remove(id: string) {
    await this.prisma.menu.delete({ where: { id } });
    return this.prisma.success();
  }
}
