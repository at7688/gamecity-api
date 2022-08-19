import { getAllParents } from './../member/raw/getAllParents';
import { SearchPlayersDto } from './dto/search-players.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { LoginUser } from 'src/types';
import { Member, Player, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { MemberService } from 'src/member/member.service';
import { SubPlayer, subPlayers } from 'src/player/raw/subPlayers';
import { SubAgent, subAgents } from './raw/subAgents';
import { playerList } from './raw/playerList';

@Injectable()
export class PlayerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly memberService: MemberService,
  ) {}
  isAdmin = this.configService.get('PLATFORM') === 'ADMIN';

  async create(data: CreatePlayerDto, user: LoginUser) {
    const { password, username, nickname, agent_id, phone, email } = data;
    const hash = await argon2.hash(password);

    // 如果有初始化VIP, 則同時綁定
    const vip = (
      await this.prisma.vip.findMany({
        where: { ebet_min: 0, deposite_min: 0 },
        orderBy: { name: 'asc' },
      })
    )[0];

    if (!this.isAdmin) {
      const agents = await this.prisma.$queryRaw<SubAgent[]>(
        subAgents(user.id),
      );
      if (agents.findIndex((t) => t.id === agent_id) === -1) {
        throw new BadRequestException('無此下線');
      }
    }

    return this.prisma.player.create({
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
        is_blocked: { 0: undefined, 1: true, 2: false }[is_blocked],
        is_lock_bet: { 0: undefined, 1: true, 2: false }[is_lock_bet],
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
      items: await this.prisma.$queryRaw(playerList(_items.map((t) => t.id))),
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
    return {
      parents: await this.prisma.$queryRaw(getAllParents(player.agent_id)),
      player,
    };
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
