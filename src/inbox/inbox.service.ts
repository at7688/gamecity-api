import {
  AdminUser,
  Inbox,
  InboxSendType,
  Member,
  MemberType,
  Prisma,
} from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInboxDto } from './dto/create-inbox.dto';
import { UpdateInboxDto } from './dto/update-inbox.dto';
import { LoginUser, SimpleMember } from '../types';
import { SearchInboxsDto } from './dto/search-announcements.dto';

@Injectable()
export class InboxService {
  constructor(private readonly prisma: PrismaService) {}

  pushSubMembers = async (where: Prisma.MemberWhereInput) => {
    const newMembers = await this.prisma.member.findMany({
      where,
      select: {
        id: true,
        username: true,
        nickname: true,
        subs: {
          select: {
            id: true,
            username: true,
            nickname: true,
          },
          where: { ...where, parent_id: undefined },
        },
      },
    });
    newMembers.forEach(async (m) => {
      if (m.subs.length) {
        newMembers.concat(
          await this.pushSubMembers({ ...where, parent_id: m.id }),
        );
      }
    });

    return newMembers;
  };

  async create(data: CreateInboxDto, user: LoginUser) {
    let toMembers: SimpleMember[] = [];

    switch (data.send_type) {
      case InboxSendType.PRIVATE:
        toMembers = await this.prisma.member.findMany({
          where: {
            username: data.username,
          },
        });
        break;
      case InboxSendType.PLAYERS:
        toMembers = await this.pushSubMembers({
          parent_id: 'admin_role_id' in user ? undefined : user.id,
          type: MemberType.PLAYER,
        });
        break;
      case InboxSendType.AGENTS:
        toMembers = await this.pushSubMembers({
          parent_id: 'admin_role_id' in user ? undefined : user.id,
          type: MemberType.AGENT,
        });
        break;

      default:
        break;
    }

    // return this.prisma.inbox.createMany({
    //   data: toMembers.map((m) => ({
    //     // from_member_id: user.id,
    //     to_member_id: m.id,
    //     inbox_rec_id: 'cl5n80zq300109vpxm3qon5hf',
    //   })),
    // });

    return this.prisma.inboxRec.create({
      data: {
        ...data,
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
          username,
          nickname,
        },
      },
      include: {
        inbox_rec: true,
        from_user: {
          select: { id: true, nickname: true, username: true },
        },
        from_member: {
          select: { id: true, nickname: true, username: true },
        },
        to_member: {
          select: { id: true, nickname: true, username: true },
        },
      },
      orderBy: [{ inbox_rec: { sended_at: 'desc' } }],
      take: perpage,
      skip: (page - 1) * perpage,
    };
    const [items, count] = await this.prisma.$transaction([
      this.prisma.inbox.findMany(findManyArgs),
      this.prisma.inbox.count({ where: findManyArgs.where }),
    ]);

    return {
      items,
      count,
      search,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} inbox`;
  }

  update(id: number, updateInboxDto: UpdateInboxDto) {
    return `This action updates a #${id} inbox`;
  }

  remove(id: number) {
    return `This action removes a #${id} inbox`;
  }
}
