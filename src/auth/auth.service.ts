import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminRole, AdminUser, Member, Menu } from '@prisma/client';
import * as argon2 from 'argon2';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { SigninDto } from './dto/signin.dto';
import * as IP from 'ip';
import { ConfigService } from '@nestjs/config';
import { LoginUser } from 'src/types';

export type MenuWithSubMenu = Menu & {
  sub_menus: Menu[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  fetchRolePermission(role: string) {
    return this.prisma.permission.findMany({
      where: {
        menus: {
          some: {
            admin_roles: {
              some: {
                code: role,
              },
            },
          },
        },
      },
    });
  }

  fetchRoleMenu(role: string) {
    return this.prisma.menu.findMany({
      where: {
        root_menu: null,
        admin_roles: {
          some: {
            code: role,
          },
        },
      },
      include: {
        sub_menus: {
          where: {
            admin_roles: {
              some: {
                code: role,
              },
            },
          },
          orderBy: { sort: 'asc' },
        },
      },
      orderBy: { sort: 'asc' },
    });
  }

  async agentLogin({ username, password }: SigninDto) {
    const user = await this.prisma.member.findUnique({
      where: { username },
    });
    return await this.loginErrHandler(user, 'AGENT', password);
  }

  async passwordValidate(password: string, input_password: string) {
    // 密碼驗證
    const isPasswordValid = await argon2.verify(password, input_password);
    if (!isPasswordValid) {
      throw new BadRequestException('bad password');
    }
  }

  async loginErrHandler(
    user: AdminUser | Member,
    role: string,
    password: string,
  ) {
    // 獲取帳戶失敗
    if (!user) {
      throw new BadRequestException('user is not exist');
    }

    // 是否為管理員
    const isAdmin = role !== 'AGENT';

    try {
      // 帳戶已封鎖，禁止登入
      if (user.is_blocked) {
        throw new BadRequestException('帳戶已鎖定');
      }
      // 密碼驗證
      await this.passwordValidate(user.password, password);

      // 獲取TOKEN
      const token = this.jwtService.sign({
        username: user.username,
        sub: user.id,
      });

      // 登入成功紀錄
      await this.prisma.loginRec.create({
        data: {
          [isAdmin ? 'admin_user' : 'agent']: {
            connect: {
              username: user.username,
            },
          },
          ip: IP.address(),
          nums_failed: 0,
        },
      });

      // 取得權限選單
      const menu = await this.fetchRoleMenu(isAdmin ? role : 'AGENT');

      // 功能權限存入快取
      const permissions = await this.fetchRolePermission(
        isAdmin ? role : 'AGENT',
      );
      await this.cacheManager.set(user.id, permissions);

      return {
        user,
        menu,
        access_token: token,
      };
    } catch (err) {
      const login_recs = await this.prisma.loginRec.findMany({
        where: {
          [isAdmin ? 'admin_user' : 'agent']: { username: user.username },
        },
        orderBy: { login_at: 'desc' },
      });
      const nums_failed = login_recs[0] ? login_recs[0]?.nums_failed + 1 : 1;
      let failed_msg = `${err.message}, 累積失敗次數：${nums_failed}次`;

      // 超過失敗登入上限，封鎖帳戶
      if (nums_failed >= +this.configService.get('FAILED_LOGIN_LIMIT')) {
        failed_msg = `已達失敗上限，帳戶已鎖定`;

        await this.prisma[isAdmin ? 'AdminUser' : 'Member'].update({
          where: {
            username: user.username,
          },
          data: {
            is_blocked: true,
          },
        });
      }

      if (user.is_blocked) {
        failed_msg = err.message;
      }

      // 登入失敗紀錄
      await this.prisma.loginRec.create({
        data: {
          [isAdmin ? 'admin_user' : 'agent']: {
            connect: {
              username: user.username,
            },
          },
          ip: IP.address(),
          failed_msg,
          nums_failed,
        },
      });

      throw new BadRequestException(failed_msg);
    }
  }

  async adminUserLogin({ username, password }: SigninDto) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username },
      include: {
        admin_role: true,
      },
    });
    return await this.loginErrHandler(user, user.admin_role.code, password);
  }

  async getLoginInfo(user: LoginUser) {
    return {
      user,
      menu: await this.fetchRoleMenu(
        'admin_role_id' in user ? user.admin_role.code : 'AGENT',
      ),
    };
  }
}
