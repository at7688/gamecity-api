import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Menu } from '@prisma/client';
import * as argon2 from 'argon2';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { SigninDto } from './dto/signin.dto';

export type MenuWithSubMenu = Menu & {
  sub_menus: Menu[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async agentValidate({ username, password }: SigninDto) {
    const users = await this.prisma.member.findMany({
      where: { username, type: 'AGENT' },
    });

    if (!users.length) {
      throw new BadRequestException('user is not exist');
    }
    const user = users[0];
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new BadRequestException('bad password');
    }

    const menu = await this.prisma.menu.findMany({
      where: {
        root_menu: null,
        admin_roles: {
          some: {
            code: 'AGENT',
          },
        },
      },
      include: {
        sub_menus: {
          where: {
            admin_roles: {
              some: {
                code: 'AGENT',
              },
            },
          },
          orderBy: { sort: 'asc' },
        },
      },
      orderBy: { sort: 'asc' },
    });

    const token = this.jwtService.sign({
      username: user.username,
      sub: user.id,
      agent: user.type === 'AGENT',
    });

    const permissions = await this.prisma.permission.findMany({
      where: {
        menus: {
          some: {
            admin_roles: {
              some: {
                code: 'AGENT',
              },
            },
          },
        },
      },
    });

    await this.cacheManager.set(user.username, permissions);

    return {
      user,
      menu,
      access_token: token,
    };
  }

  async adminUserValidate({ username, password }: SigninDto) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username },
      include: {
        admin_role: true,
      },
    });

    if (!user) {
      throw new BadRequestException('user is not exist');
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new BadRequestException('bad password');
    }

    const isMaster = user.admin_role.code === 'MASTER';

    const menu = await this.prisma.menu.findMany({
      where: {
        root_menu: null,
        admin_roles: isMaster
          ? {
              some: {
                code: user.admin_role.code,
              },
            }
          : undefined,
      },
      include: {
        sub_menus: {
          where: {
            admin_roles: isMaster
              ? {
                  some: {
                    code: user.admin_role.code,
                  },
                }
              : undefined,
          },
          orderBy: { sort: 'asc' },
        },
      },
      orderBy: { sort: 'asc' },
    });

    const token = this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });

    // await this.cacheManager.set(token, user.username);

    const permissions = await this.prisma.permission.findMany({
      where: {
        menus: {
          some: {
            admin_roles: {
              some: {
                code: user.admin_role.code,
              },
            },
          },
        },
      },
    });

    await this.cacheManager.set(user.username, permissions);

    return {
      user,
      menu,
      access_token: token,
    };
  }
}
