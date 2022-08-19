import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Member, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { CreateAgentDto } from './dto/create-agent.dto';
import { SearchAgentsDto } from './dto/search-agents.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { agentWithSubNums } from './raw/agentWithSubNums';
import { getAllParents } from './raw/getAllParents';
import { getAllSubs } from './raw/getAllSubs';
import { getTreeNode, TreeNodeMember } from './raw/getTreeNode';
@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  isAdmin = this.configService.get('PLATFORM') === 'ADMIN';

  async create({ password, ...data }: CreateAgentDto, user: LoginUser) {
    const hash = await argon2.hash(password);
    let parent: Member | null = null;
    if ('admin_role_id' in user) {
      if (data.parent_id) {
        parent = await this.prisma.member.findUnique({
          where: { id: data.parent_id },
        });
      }
    } else {
      if (data.parent_id) {
        parent = (await this.getAllSubs(user.id)).find(
          (t) => t.id === data.parent_id,
        );
        if (!parent) {
          throw new BadRequestException('上層錯誤');
        }
      } else {
        parent = user;
      }
    }

    return this.prisma.member.create({
      data: {
        ...data,
        password: hash,
        parent_id: parent?.id,
        layer: parent ? ++parent.layer : 1,
      },
    });
  }

  getAllSubs(id: string | null) {
    return this.prisma.$queryRaw<Member[]>(getAllSubs(id));
  }

  getAllParents(parent_id: string) {
    return this.prisma.$queryRaw<Member[]>(getAllParents(parent_id));
  }

  async findAll(search: SearchAgentsDto, user: LoginUser) {
    const {
      page,
      perpage,
      username,
      nickname,
      layers,
      parent_id,
      is_blocked,
      all,
    } = search;
    const findManyArgs: Prisma.MemberFindManyArgs = {
      where: {
        id: !this.isAdmin
          ? {
              in: (await this.getAllSubs(user.id)).map((t) => t.id),
            }
          : undefined,
        username: {
          contains: username,
        },
        nickname: {
          contains: nickname,
        },
        layer: {
          in: layers,
        },
        is_blocked: { 0: undefined, 1: true, 2: false }[is_blocked],
        parent_id: {
          in:
            all && parent_id
              ? await this.getAllSubs(parent_id).then((arr) =>
                  arr.map((t) => t.id).concat(parent_id),
                )
              : parent_id,
        },
      },
      take: perpage,
      skip: (page - 1) * perpage,
    };

    const parents = await this.getAllParents(parent_id);

    const _items = await this.prisma.member.findMany(findManyArgs);
    return this.prisma.listFormat({
      items: await this.prisma.$queryRaw(
        agentWithSubNums(_items.map((t) => t.id)),
      ),
      count: await this.prisma.member.count({
        where: findManyArgs.where,
      }),
      search,
      extra: {
        parents:
          'admin_role_id' in user
            ? parents
            : parents.filter((t) => t.layer <= user.layer),
      },
    });
  }

  async getTreeNode(parent_id: string, user: LoginUser) {
    const default_parent_id = 'admin_role_id' in user ? null : user.id;
    return this.prisma.$queryRaw<TreeNodeMember[]>(
      getTreeNode(parent_id || default_parent_id),
    );
  }

  findOne(id: string) {
    return this.prisma.member.findUnique({ where: { id } });
  }

  async update(id: string, { password, ...data }: UpdateMemberDto) {
    if (password) {
      const hash = await argon2.hash(password);
      return this.prisma.member.update({
        where: { id },
        data: { ...data, password: hash },
      });
    }
    return this.prisma.member.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.member.delete({ where: { id } });
  }
}
