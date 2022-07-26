import { Injectable } from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { CreateAgentDto } from './dto/create-agent.dto';
import { SearchAgentsDto } from './dto/search-agents.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { getAllParentsById } from './raw/getAllParentsById';
import { getAllSubsById } from './raw/getAllSubsById';
import { getTreeNode, TreeNodeMember } from './raw/getTreeNode';
@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}
  async createAgent({ password, ...data }: CreateAgentDto) {
    const hash = await argon2.hash(password);
    let parent: Member | null = null;
    if (data.parent_id) {
      parent = await this.prisma.member.findUnique({
        where: { id: data.parent_id },
      });
    }

    return this.prisma.member.create({
      data: {
        ...data,
        password: hash,
        layer: parent ? ++parent.layer : 1,
      },
    });
  }

  async findAllAgents(search: SearchAgentsDto, user: LoginUser) {
    const {
      page,
      perpage,
      username,
      nickname,
      layers,
      parent_id,
      is_block,
      all,
    } = search;
    const default_parent_id = 'admin_role_id' in user ? null : user.id;
    const findManyArgs: Prisma.AgentWithSubNumsFindManyArgs = {
      where: {
        type: 'AGENT',
        username: {
          contains: username,
        },
        nickname: {
          contains: nickname,
        },
        layer: {
          in: layers,
        },
        is_blocked: { 0: undefined, 1: true, 2: false }[is_block],
        parent_id: {
          in:
            all && parent_id
              ? await this.prisma
                  .$queryRaw<Member[]>(getAllSubsById(parent_id, 'AGENT'))
                  .then((arr) => arr.map((t) => t.id).concat(parent_id))
              : parent_id || default_parent_id,
        },
      },
      orderBy: [
        {
          layer: 'asc',
        },
        {
          created_at: 'desc',
        },
      ],
      take: perpage,
      skip: (page - 1) * perpage,
    };

    const [items, count] = await this.prisma.$transaction([
      this.prisma.agentWithSubNums.findMany(findManyArgs),
      this.prisma.agentWithSubNums.count({
        where: findManyArgs.where,
      }),
    ]);

    return {
      items,
      count,
      search,
      parents: await this.prisma.$queryRaw(getAllParentsById(parent_id)),
    };
  }

  async findAllByParent(parent_id: string, user: LoginUser) {
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
