import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminUser, Member, Menu, Player, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { Cache } from 'cache-manager';
import { playerRolling } from 'src/player/raw/playerRolling';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { LoginDto } from './dto/login.dto';
import { JwtParams } from './types';

export type MenuWithSubMenu = Menu & {
  sub_menus: Menu[];
};

interface AdminRoleLogin {
  platform: 'ADMIN';
  user: AdminUser;
  role: string;
  password: string;
  ip: string;
}
interface AgentLogin {
  platform: 'AGENT';
  user: Member;
  password: string;
  ip: string;
}
interface PlayerLogin {
  platform: 'PLAYER';
  user: Player;
  password: string;
  ip: string;
}

export type LoginHandlerParams = AdminRoleLogin | AgentLogin | PlayerLogin;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  platform = this.configService.get('PLATFORM');

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
        },
      },
      orderBy: { sort: 'asc' },
    });
  }

  async adminUserLogin({ username, password }: LoginDto, ip: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username },
      include: {
        admin_role: true,
      },
    });

    return await this.loginErrHandler({
      platform: 'ADMIN',
      password,
      user,
      role: user?.admin_role.code,
      ip,
    });
  }

  async agentLogin({ username, password }: LoginDto, ip: string) {
    const user = await this.prisma.member.findUnique({
      where: { username },
    });
    return await this.loginErrHandler({
      platform: 'AGENT',
      password,
      user,
      ip,
    });
  }
  async playerLogin({ username, password }: LoginDto, ip: string) {
    const user = await this.prisma.player.findUnique({
      where: { username },
      include: {
        vip: {
          select: {
            name: true,
            deposit_min: true,
            withdraw_min: true,
            withdraw_max: true,
          },
        },
      },
    });
    return await this.loginErrHandler({
      platform: 'PLAYER',
      password,
      user,
      ip,
    });
  }

  async passwordValidate(password: string, input_password: string) {
    // 密碼驗證
    const isPasswordValid = await argon2.verify(password, input_password);
    if (!isPasswordValid) {
      throw new BadRequestException('bad password');
    }
  }

  async logout(user: Player | LoginUser) {
    const record = await this.prisma.loginRec.findFirst({
      where: {
        OR: [
          { admin_user_id: user.id },
          { player_id: user.id },
          { agent_id: user.id },
        ],
      },
      orderBy: {
        login_at: 'desc',
      },
    });
    await this.prisma.loginRec.update({
      where: { id: record.id },
      data: { token: null },
    });
    return this.prisma.success();
  }

  async loginErrHandler({ user, password, ip, ...params }: LoginHandlerParams) {
    // 獲取帳戶失敗
    if (!user) {
      throw new BadRequestException('user is not exist');
    }

    // 帳戶已封鎖，禁止登入
    if (user.is_blocked) {
      throw new BadRequestException('帳戶已鎖定');
    }
    // 密碼驗證
    await this.passwordValidate(user.password, password);

    try {
      // 獲取TOKEN
      const token = this.jwtService.sign({
        username: user.username,
        sub: user.id,
        platform: this.platform,
      });

      // 登入成功紀錄
      await this.prisma.loginRec.create({
        data: {
          [{ ADMIN: 'admin_user', AGENT: 'agent', PLAYER: 'player' }[
            this.platform
          ]]: {
            connect: {
              username: user.username,
            },
          },
          ip,
          nums_failed: 0,
          platform: this.platform,
          token,
        },
      });

      if (params.platform === 'PLAYER') {
        return {
          user,
          access_token: token,
        };
      }

      let role = 'AGENT';

      if (params.platform === 'ADMIN') {
        role = params.role;
      }
      // 取得權限選單
      const menu = await this.fetchRoleMenu(
        this.platform === 'ADMIN' ? role : 'AGENT',
      );

      // 功能權限存入快取
      const permissions = await this.fetchRolePermission(
        this.platform === 'ADMIN' ? role : 'AGENT',
      );
      await this.cacheManager.set(user.id, permissions);

      return {
        user,
        menu,
        access_token: token,
      };
    } catch (err) {
      const login_rec = await this.prisma.loginRec.findFirst({
        where: {
          [{ ADMIN: 'admin_user', AGENT: 'agent', PLAYER: 'player' }[
            this.platform
          ]]: {
            username: user.username,
          },
        },
        orderBy: { login_at: 'desc' },
      });
      const nums_failed = login_rec ? login_rec?.nums_failed + 1 : 1;
      let failed_msg = `${err.message}, 累積失敗次數：${nums_failed}次`;

      // 超過失敗登入上限，封鎖帳戶
      if (nums_failed >= +this.configService.get('FAILED_LOGIN_LIMIT')) {
        failed_msg = `已達失敗上限，帳戶已鎖定`;

        await this.prisma[
          { ADMIN: 'AdminUser', AGENT: 'Member', PLAYER: 'Player' }[
            this.platform
          ]
        ].update({
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
          [{ ADMIN: 'admin_user', AGENT: 'agent', PLAYER: 'player' }[
            this.platform
          ]]: {
            connect: {
              username: user.username,
            },
          },
          ip,
          failed_msg,
          nums_failed,
          platform: this.platform,
        },
      });

      throw new BadRequestException(failed_msg);
    }
  }

  async getAdminInfo(loginUser: AdminUser) {
    const user = await this.prisma.adminUser.findUnique({
      where: {
        id: loginUser.id,
      },
      include: {
        admin_role: true,
      },
    });
    return this.prisma.success({
      user,
      menu: await this.fetchRoleMenu(user.admin_role.code),
    });
  }

  async getAgentInfo(agent: Member) {
    const user = await this.prisma.member.findUnique({
      where: {
        id: agent.id,
      },
    });
    return this.prisma.success({
      user,
      menu: await this.fetchRoleMenu('AGENT'),
    });
  }

  async getPlayerInfo(player: Player) {
    const user = await this.prisma.player.findUnique({
      where: {
        id: player.id,
      },
      include: {
        game_accounts: {
          select: {
            platform_code: true,
            credit: true,
          },
        },
      },
    });
    const rollingInfo =
      (await this.prisma.$queryRaw(playerRolling(user.id)))[0] || {};
    return this.prisma.success({ ...user, ...rollingInfo });
  }

  playerValidate(token: string) {
    return this.jwtService.decode(token) as JwtParams;
  }
}
