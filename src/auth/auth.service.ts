import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

    return {
      user,
      menu,
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
        agent: user.type === 'AGENT',
      }),
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

    if (user.admin_role.code === 'MASTER') {
      const menu = await this.prisma.menu.findMany({
        where: { root_menu: null },
        include: {
          sub_menus: {
            orderBy: { sort: 'asc' },
          },
        },
        orderBy: { sort: 'asc' },
      });

      return {
        user,
        menu,
        access_token: this.jwtService.sign({
          username: user.username,
          sub: user.id,
        }),
      };
    }

    const menu = await this.prisma.menu.findMany({
      where: {
        root_menu: null,
        admin_roles: {
          some: {
            code: user.admin_role.code,
          },
        },
      },
      include: {
        sub_menus: {
          where: {
            admin_roles: {
              some: {
                code: user.admin_role.code,
              },
            },
          },
          orderBy: { sort: 'asc' },
        },
      },
      orderBy: { sort: 'asc' },
    });

    return {
      user,
      menu,
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }
}
