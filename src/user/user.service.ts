import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, AdminUser, LoginRec } from '@prisma/client';
import * as argon2 from 'argon2';
import { ResCode } from 'src/errors/enums';
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
      this.prisma.error(ResCode.NOT_FOUND);
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
        login_rec: {
          take: 5,
          orderBy: {
            login_at: 'desc',
          },
        },
      },
      orderBy: [{ id: 'desc' }],
      take: perpage || 10,
      skip: (page - 1) * perpage || 0,
    };

    return this.prisma.listFormat({
      items: await this.prisma.adminUser.findMany(findManyArgs),
      count: await this.prisma.adminUser.count({ where: findManyArgs.where }),
      search,
    });
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
