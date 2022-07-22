import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}
  create({ permission_ids, ...data }: CreateMenuDto) {
    return this.prisma.menu.create({
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
  }

  pathGetSubMenus(path: string, user: LoginUser) {
    const roleCode = 'admin_role_id' in user ? user.admin_role.code : 'AGENT';
    return this.prisma.menu.findUnique({
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
  }

  findAll() {
    return this.prisma.menu.findMany({
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
  }

  findOne(id: string) {
    return this.prisma.menu.findUnique({ where: { id } });
  }

  update(id: string, { permission_ids, ...data }: UpdateMenuDto) {
    return this.prisma.menu.update({
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
  }

  remove(id: string) {
    return this.prisma.menu.delete({ where: { id } });
  }
}
