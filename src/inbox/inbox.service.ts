import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { TargetType } from 'src/enums';
import { MemberService } from 'src/member/member.service';
import { SubAgent, subAgents } from 'src/player/raw/subAgents';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from '../types';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { SearchInboxsDto } from './dto/search-inboxs.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';
import { InboxViewType, ReadStatus } from './enums';

@Injectable()
export class InboxService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly memberService: MemberService,
  ) {}

  isAdmin = this.configService.get('PLATFORM') === 'ADMIN';

  simpleMemberSelect = {
    id: true,
    nickname: true,
    username: true,
    layer: true,
  };

  inboxInclude: Prisma.InboxInclude = {
    inbox_rec: {
      select: {
        title: true,
        content: true,
        target_type: true,
        sended_at: true,
        _count: true,
      },
    },
    from_user: {
      select: {
        id: true,
        nickname: true,
        username: true,
        admin_role: true,
      },
    },
    from_member: {
      select: this.simpleMemberSelect,
    },
    to_member: {
      select: this.simpleMemberSelect,
    },
    to_player: {
      select: {
        id: true,
        nickname: true,
        username: true,
        agent: {
          select: this.simpleMemberSelect,
        },
      },
    },
  };

  async checkCreateTargets(data: CreateInboxDto, user: LoginUser) {
    if (this.isAdmin) {
      // 管理站
      if (data.target_type === TargetType.AGENT) {
        return this.prisma.member.findMany({
          select: {
            id: true,
            nickname: true,
            username: true,
          },
          where: {
            username: data.username,
          },
        });
      } else {
        return this.prisma.player.findMany({
          select: {
            id: true,
            username: true,
            nickname: true,
          },
          where: {
            username: data.username,
          },
        });
      }
    } else {
      // 代理站
      if (data.target_type === TargetType.AGENT) {
        return this.prisma.member.findMany({
          select: {
            id: true,
            nickname: true,
            username: true,
          },
          where: {
            id: {
              in: (await this.memberService.getAllSubs(user.id)).map(
                (t) => t.id,
              ),
            },
            username: data.username,
          },
        });
      } else {
        return this.prisma.player.findMany({
          select: {
            id: true,
            username: true,
            nickname: true,
          },
          where: {
            username: data.username,
            agent: {
              id: {
                in: (
                  await this.prisma.$queryRaw<SubAgent[]>(subAgents(user.id))
                ).map((t) => t.id),
              },
            },
          },
        });
      }
    }
  }

  async create(data: CreateInboxDto, user: LoginUser) {
    const toMembers = await this.checkCreateTargets(data, user);
    if (toMembers.length === 0) {
      throw new BadRequestException('發信對象為空');
    }
    return this.prisma.inboxRec.create({
      data: {
        title: data.title,
        content: data.content,
        target_type: data.target_type,
        inboxs: {
          createMany: {
            data: toMembers.map((m) => ({
              [this.isAdmin ? 'from_user_id' : 'from_member_id']: user.id,
              [data.target_type === TargetType.AGENT
                ? 'to_member_id'
                : 'to_player_id']: m.id,
            })),
          },
        },
      },
      include: {
        _count: { select: { inboxs: true } },
      },
    });
  }

  async findAll(search: SearchInboxsDto, user: LoginUser) {
    const {
      page,
      perpage,
      title,
      username,
      nickname,
      target_type,
      view_type,
      is_read,
    } = search;

    let where: Prisma.InboxWhereInput = {
      inbox_rec: {
        title: {
          contains: title,
        },
        target_type,
      },
      opened_at:
        is_read === ReadStatus.READ
          ? {
              not: null,
            }
          : is_read === ReadStatus.UNREAD
          ? {
              equals: null,
            }
          : undefined,
    };

    if (view_type === InboxViewType.SEND) {
      where = {
        ...where,
        [this.isAdmin ? 'from_user_id' : 'from_member_id']: user.id,
      };
      if (target_type === TargetType.AGENT) {
        where = {
          ...where,
          to_member: {
            username: { contains: username },
            nickname: { contains: nickname },
          },
        };
        console.log(where);
      } else if (target_type === TargetType.PLAYER) {
        where = {
          ...where,
          to_player: {
            username: { contains: username },
            nickname: { contains: nickname },
          },
        };
      }
    } else {
      where = {
        ...where,
        to_member: {
          id: user.id,
        },
      };
    }

    const findManyArgs: Prisma.InboxFindManyArgs = {
      where,
      include: this.inboxInclude,
      orderBy: [{ inbox_rec: { sended_at: 'desc' } }],
      take: perpage,
      skip: (page - 1) * perpage,
    };

    return this.prisma.listFormat({
      items: await this.prisma.inbox.findMany(findManyArgs),
      count: await this.prisma.inbox.count({ where: findManyArgs.where }),
      search,
    });
  }

  findOne(id: string) {
    return this.prisma.inbox.findUnique({
      where: { id },
      include: this.inboxInclude,
    });
  }

  async updateRead(id: string, user: LoginUser) {
    const target = await this.prisma.inbox.findUnique({
      where: { id },
    });
    if (target.to_member_id !== user.id) {
      throw new BadRequestException('非信件接收者');
    }
    return this.prisma.inbox.update({
      where: { id },
      data: { opened_at: new Date() },
    });
  }

  update(id: string, updateInboxDto: UpdateInboxDto) {
    return `This action updates a #${id} inbox`;
  }

  remove(id: string) {
    return `This action removes a #${id} inbox`;
  }
}
