import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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

  pathGetSubMenus(path: string) {
    return this.prisma.menu.findMany({
      where: {
        root_menu: {
          path,
        },
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
            sub_menus: true,
          },
        },
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
