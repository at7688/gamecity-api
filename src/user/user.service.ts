import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, AdminUser } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<AdminUser | null> {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
      include: {
        admin_role: {
          include: {
            menu: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findAll(search: SearchUserDto) {
    const { page, perpage, username, is_active } = search;
    const findManyArgs: Prisma.AdminUserFindManyArgs = {
      where: {
        username,
        is_active,
      },
      include: {
        admin_role: true,
      },
      orderBy: [{ id: 'desc' }],
      take: perpage || 10,
      skip: (page - 1) * perpage || 0,
    };

    const [items, count_all, count_is_active] = await this.prisma.$transaction([
      this.prisma.adminUser.findMany(findManyArgs),
      this.prisma.adminUser.count({ where: findManyArgs.where }),
      this.prisma.adminUser.count({
        where: { ...findManyArgs.where, is_active: true },
      }),
    ]);

    return {
      items,
      counts: {
        all: count_all,
        is_active: count_is_active,
      },
      search,
    };
  }

  async create({ password, ...data }: CreateUserDto): Promise<AdminUser> {
    const hash = await argon2.hash(password);

    return await this.prisma.adminUser.create({
      data: {
        username: data.username,
        nickname: data.nickname,
        admin_role: {
          connect: { id: data.admin_role_id },
        },
        password: hash,
      },
    });
  }

  async update(
    id: string,
    { password, ...data }: UpdateUserDto,
  ): Promise<AdminUser> {
    if (password) {
      const hash = await argon2.hash(password);
      return this.prisma.adminUser.update({
        where: { id },
        data: { ...data, password: hash },
      });
    }
    return this.prisma.adminUser.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.adminUser.delete({ where: { id } });
  }
}
