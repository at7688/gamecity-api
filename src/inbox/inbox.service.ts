import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InboxSendType, MemberType, Prisma } from '@prisma/client';
import { getAllSubs } from 'src/member/raw/getAllSubs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from '../types';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { SearchInboxsDto } from './dto/search-inboxs.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class InboxService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly memberService: MemberService,
  ) {}

  isAdmin = this.configService.get('SITE_TYPE') === 'ADMIN';

  simpleMemberSelect = {
    id: true,
    nickname: true,
    username: true,
    layer: true,
    type: true,
  };

  inboxInclude: Prisma.InboxInclude = {
    inbox_rec: {
      select: {
        title: true,
        content: true,
        send_type: true,
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
  };

  async checkCreateTargets(data: CreateInboxDto, user: LoginUser) {
    let toMembers: {
      id: string;
      username: string;
      nickname: string;
      type: MemberType;
      layer: number;
    }[] = [];

    switch (data.send_type) {
      case InboxSendType.PRIVATE:
        toMembers = await this.prisma.member.findMany({
          select: this.simpleMemberSelect,
          where: {
            id: !this.isAdmin
              ? {
                  in: (
                    await this.memberService.getAllSubs(user.id)
                  ).map((t) => t.id),
                }
              : undefined,
            username: {
              in: data.username.split(',').map((t) => t.trim()),
            },
          },
        });
        break;
      case InboxSendType.PLAYERS:
        toMembers = await this.memberService.getAllSubs(
          user.id,
          MemberType.PLAYER,
        );
        break;
      case InboxSendType.AGENTS:
        toMembers = await this.memberService.getAllSubs(
          user.id,
          MemberType.AGENT,
        );
        break;

      default:
        break;
    }

    return toMembers;
  }

  async create(data: CreateInboxDto, user: LoginUser) {
    const toMembers: { id: string; username: string }[] =
      await this.checkCreateTargets(data, user);

    return this.prisma.inboxRec.create({
      data: {
        title: data.title,
        content: data.content,
        send_type: data.send_type,
        inboxs: {
          createMany: {
            data: toMembers.map((m) => ({
              [this.isAdmin ? 'from_user_id' : 'from_member_id']: user.id,
              to_member_id: m.id,
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
      send_type,
      type,
      is_read,
    } = search;

    let where: Prisma.InboxWhereInput = {
      inbox_rec: {
        title: {
          contains: title,
        },
        send_type,
      },
      opened_at:
        is_read === 1
          ? {
              not: null,
            }
          : is_read === 2
          ? {
              equals: null,
            }
          : undefined,
    };

    if (type === 1) {
      where = {
        ...where,
        [this.isAdmin ? 'from_user_id' : 'from_member_id']: user.id,
        to_member: {
          username: { contains: username },
          nickname: { contains: nickname },
        },
      };
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

  update(id: number, updateInboxDto: UpdateInboxDto) {
    return `This action updates a #${id} inbox`;
  }

  remove(id: number) {
    return `This action removes a #${id} inbox`;
  }
}
