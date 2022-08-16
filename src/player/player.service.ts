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
  isAdmin = this.configService.get('SITE_TYPE') === 'ADMIN';

  async create({ password, ...data }: CreatePlayerDto, user: LoginUser) {
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
      if (agents.findIndex((t) => t.id === data.agent_id) === -1) {
        throw new BadRequestException('無此下線');
      }
    }

    return this.prisma.player.create({
      data: {
        ...data,
        password: hash,
        vip_id: vip?.id,
      },
    });
  }

  async findAll(search: SearchPlayersDto, user: LoginUser) {
    const {
      page,
      perpage,
      username,
      nickname,
      vips,
      inviter_id,
      is_block,
      all,
    } = search;

    const findManyArgs: Prisma.PlayerFindManyArgs = {
      where: {
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
        is_blocked: { 0: undefined, 1: true, 2: false }[is_block],
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

  findOne(id: string) {
    return `This action returns a #${id} player`;
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto) {
    return `This action updates a #${id} player`;
  }

  remove(id: string) {
    return `This action removes a #${id} player`;
  }
}
