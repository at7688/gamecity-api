import { BadRequestException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto } from '../user/dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validate({ username, password }: SigninDto) {
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

    const menu = await this.prisma.menu.findMany({
      where: {
        root_menu: null,
        admin_roles: {
          some: {
            id: user.admin_role_id,
          },
        },
      },
      include: {
        sub_menus: {
          where: {
            admin_roles: {
              some: {
                id: user.admin_role_id,
              },
            },
          },
        },
      },
    });

    return {
      ...user,
      menu,
    };
  }
}
