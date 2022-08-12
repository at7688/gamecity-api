import { Injectable } from '@nestjs/common';
import { InboxSendType, MemberType, Prisma } from '@prisma/client';
import { getAllSubsById } from 'src/member/raw/getAllSubsById';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from '../types';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { SearchInboxsDto } from './dto/search-inboxs.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';

@Injectable()
export class InboxService {
  constructor(private readonly prisma: PrismaService) {}

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
      select: {
        id: true,
        nickname: true,
        username: true,
        layer: true,
        type: true,
      },
    },
    to_member: {
      select: {
        id: true,
        nickname: true,
        username: true,
        layer: true,
        type: true,
      },
    },
  };

  async create(data: CreateInboxDto, user: LoginUser) {
    const isAdmin = 'admin_role_id' in user;
    let toMembers: { id: string; username: string }[] = [];

    switch (data.send_type) {
      case InboxSendType.PRIVATE:
        toMembers = await this.prisma.member.findMany({
          select: {
            id: true,
            username: true,
          },
          where: {
            username: data.username,
          },
        });
        break;
      case InboxSendType.PLAYERS:
        toMembers = await this.prisma.$queryRaw(
          getAllSubsById(isAdmin ? null : user.id, MemberType.PLAYER),
        );
        break;
      case InboxSendType.AGENTS:
        toMembers = await this.prisma.$queryRaw(
          getAllSubsById(isAdmin ? null : user.id, MemberType.AGENT),
        );
        break;

      default:
        break;
    }

    return this.prisma.inboxRec.create({
      data: {
        title: data.title,
        content: data.content,
        send_type: data.send_type,
        inboxs: {
          createMany: {
            data: toMembers.map((m) => ({
              ['admin_role_id' in user ? 'from_user_id' : 'from_member_id']:
                user.id,
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
    const { page, perpage, title, username, nickname, send_type } = search;

    const findManyArgs: Prisma.InboxFindManyArgs = {
      where: {
        ['admin_role_id' in user ? 'from_user_id' : 'from_member_id']: user.id,
        inbox_rec: {
          title: {
            contains: title,
          },
          send_type,
        },
        to_member: {
          username: { contains: username },
          nickname: { contains: nickname },
        },
      },
      include: this.inboxInclude,
      orderBy: [{ inbox_rec: { sended_at: 'desc' } }],
      take: perpage,
      skip: (page - 1) * perpage,
    };

    return {
      items: await this.prisma.inbox.findMany(findManyArgs),
      count: await this.prisma.inbox.count({ where: findManyArgs.where }),
      search,
    };
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
