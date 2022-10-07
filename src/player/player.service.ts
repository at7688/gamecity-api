import { RegisterPlayerDto } from './dto/register-player.dto';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { MemberService } from 'src/member/member.service';
import { SubPlayer, subPlayers } from 'src/player/raw/subPlayers';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { numToBooleanSearch } from 'src/utils';
import { getAllParents, ParentBasic } from './../member/raw/getAllParents';
import { CreatePlayerDto } from './dto/create-player.dto';
import { SearchPlayersDto } from './dto/search-players.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { playerList } from './raw/playerList';
import { SubAgent, subAgents } from './raw/subAgents';
import { TargetType } from 'src/enums';
import { ResCode } from 'src/errors/enums';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { REGISTER_REQUIRED } from 'src/sys-config/consts';
import { RegisterPayload } from 'src/socket/types';
import { PlayerTagType } from './enums';

@Injectable()
export class PlayerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  isAdmin = this.configService.get('PLATFORM') === 'ADMIN';

  async validate(username: string) {
    const record = await this.prisma.player.findUnique({
      where: {
        username,
      },
    });
    return this.prisma.success(!!record ? 'INVALID' : 'VALID');
  }

  async register(data: RegisterPlayerDto) {
    const {
      password,
      username,
      nickname,
      invited_code,
      phone_code,
      phone,
      email,
      line_id,
    } = data;

    const config = await this.prisma.sysConfig.findUnique({
      where: { code: REGISTER_REQUIRED },
    });

    const requiredFields = config.value.split(',');

    if (requiredFields.includes('LINE') && !line_id) {
      this.prisma.error(ResCode.FIELD_NOT_VALID, 'LineID為必填');
    }
    if (requiredFields.includes('EMAIL') && !email) {
      this.prisma.error(ResCode.FIELD_NOT_VALID, 'Email為必填');
    }

    const code = await this.cacheManager.get<string>(phone);

    // if (phone_code !== code) {
    //   this.prisma.error(ResCode.INVALID_PHONE_CODE, '手機驗證碼錯誤');
    // }

    const hash = await argon2.hash(password);

    const invitedPromo = await this.prisma.promoCode.findFirst({
      where: {
        type: TargetType.PLAYER,
        code: invited_code,
      },
      include: {
        parent: {
          select: {
            username: true,
          },
        },
        inviter: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!invitedPromo) {
      this.prisma.error(ResCode.NOT_FOUND, '推薦碼不可用');
    }
    const { parent_id, inviter_id } = invitedPromo;

    // 如果有初始化VIP, 則同時綁定
    const vip = await this.prisma.vip.findFirst({
      where: { valid_bet: 0, deposit_min: 0 },
      orderBy: { name: 'asc' },
    });

    const dupicated = await this.prisma.player.findFirst({
      where: {
        OR: [
          {
            contact: {
              phone,
            },
          },
          {
            username,
          },
        ],
      },
    });
    if (dupicated) {
      this.prisma.error(ResCode.DATA_DUPICATED, '手機或帳號重複');
    }

    try {
      const player = await this.prisma.player.create({
        data: {
          username,
          nickname,
          agent_id: parent_id,
          inviter_id,
          password: hash,
          vip_id: vip?.id,
          invited_code,
          contact: {
            create: {
              phone,
              email: email || null,
            },
          },
          tags: {
            create: {
              type: PlayerTagType.VERIFIED_PHONE,
            },
          },
        },
        include: {
          agent: true,
          inviter: true,
        },
      });

      const parents = await this.prisma.$queryRaw<ParentBasic[]>(
        getAllParents(player.agent.id),
      );

      const master_agent = parents.find((t) => t.parent_id === null);

      const notify: RegisterPayload = {
        username: player.username,
        nickname: player.nickname,
        agent_username: player.agent.username,
        agent_nickname: player.agent.nickname,
        inviter_username: player.inviter?.username,
        inviter_nickname: player.inviter?.nickname,
        master_agent_nickname: master_agent.nickname,
        master_agent_username: master_agent.username,
        time: player.created_at,
      };

      this.eventEmitter.emit('player.register', notify);
    } catch (err) {
      console.log(err);
      this.prisma.error(ResCode.DB_ERR, JSON.stringify(err));
    }

    return this.prisma.success();
  }
  async create(data: CreatePlayerDto, user: LoginUser) {
    const { password, username, nickname, agent_id, phone, email } = data;
    const hash = await argon2.hash(password);

    // 如果有初始化VIP, 則同時綁定
    const vip = await this.prisma.vip.findFirst({
      where: { valid_bet: 0, deposit_min: 0 },
      orderBy: { name: 'asc' },
    });

    if (!this.isAdmin) {
      const agents = await this.prisma.$queryRaw<SubAgent[]>(
        subAgents(user.id),
      );
      if (agents.findIndex((t) => t.id === agent_id) === -1) {
        this.prisma.error(ResCode.FIELD_NOT_VALID, '無此下線');
      }
    }

    await this.prisma.player.create({
      data: {
        username,
        nickname,
        agent_id,
        password: hash,
        vip_id: vip?.id,
        contact: {
          create: {
            phone,
            email: email || null,
          },
        },
      },
    });

    return this.prisma.success();
  }

  async findAll(search: SearchPlayersDto, user: LoginUser) {
    const {
      page,
      perpage,
      username,
      nickname,
      vip_ids,
      inviter_id,
      is_blocked,
      created_start_at,
      created_end_at,
      phone,
      email,
      is_lock_bet,
      agent_id,
    } = search;

    const findManyArgs: Prisma.PlayerFindManyArgs = {
      where: {
        agent_id,
        contact: {
          phone,
          email,
        },
        created_at: {
          gte: created_start_at,
          lte: created_end_at,
        },
        vip_id: {
          in: vip_ids?.length ? vip_ids : undefined,
        },
        id: !this.isAdmin
          ? {
              in: (
                await this.prisma.$queryRaw<SubPlayer[]>(subPlayers(user.id))
              ).map((t) => t.id),
            }
          : undefined,
        username: {
          contains: username,
        },
        nickname: {
          contains: nickname,
        },
        is_blocked: numToBooleanSearch(is_blocked),
        is_lock_bet: numToBooleanSearch(is_lock_bet),
      },
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
      take: perpage,
      skip: (page - 1) * perpage,
    };

    const _items = await this.prisma.player.findMany(findManyArgs);

    return this.prisma.listFormat({
      items: await this.prisma.$queryRaw<unknown[]>(
        playerList(_items.map((t) => t.id)),
      ),
      count: await this.prisma.player.count({
        where: findManyArgs.where,
      }),
      search,
    });
  }

  async findOne(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: {
        contact: {
          select: {
            email: true,
            phone: true,
            line_id: true,
            telegram: true,
          },
        },
      },
    });

    return this.prisma.success({
      parents: await this.prisma.$queryRaw(getAllParents(player.agent_id)),
      player,
    });
  }

  async updatePw(id: string, password: string) {
    const hash = await argon2.hash(password);
    return this.prisma.player.update({
      where: { id },
      data: { password: hash },
    });
  }
  async updateBlocked(id: string, is_blocked: boolean) {
    return this.prisma.player.update({
      where: { id },
      data: { is_blocked },
    });
  }

  async update(id: string, data: UpdatePlayerDto) {
    const { nickname, phone, email, line_id, telegram } = data;

    return this.prisma.player.update({
      where: { id },
      data: {
        nickname,
        contact: {
          update: {
            phone,
            email: email || null,
            line_id: line_id || null,
            telegram: telegram || null,
          },
        },
      },
      include: {
        contact: {
          select: {
            phone: true,
            email: true,
            line_id: true,
            telegram: true,
          },
        },
      },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} player`;
  }
}
