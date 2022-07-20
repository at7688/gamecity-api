import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as argon2 from 'argon2';
import { SearchMembersDto } from './dto/search-members.dto';
import { Member, MemberType, Prisma } from '@prisma/client';
import { LoginUser } from 'src/types';
import { PaginateDto } from 'src/dto/paginate.dto';
import { getAllSubsById } from './raw/getAllSubsById';
import { getAllParentsById } from './raw/getAllParentsById';
import { getTreeNode, TreeNodeMember } from './raw/getTreeNode';
@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ password, ...data }: CreateMemberDto) {
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

  async findAll(search: SearchMembersDto, user: LoginUser) {
    const { page, perpage, type, username, parent_id, all } = search;
    const default_parent_id = 'admin_role_id' in user ? null : user.id;
    const findManyArgs: Prisma.MemberFindManyArgs = {
      where: {
        type,
        username,
        parent_id: {
          in:
            all && parent_id
              ? await this.prisma
                  .$queryRaw<Member[]>(getAllSubsById(parent_id, 'AGENT'))
                  .then((arr) => arr.map((t) => t.id).concat(parent_id))
              : parent_id || default_parent_id,
        },
      },
      include: {
        login_rec: {
          take: 5,
          orderBy: {
            login_at: 'desc',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: perpage,
      skip: (page - 1) * perpage,
    };

    const [items, count] = await this.prisma.$transaction([
      this.prisma.member.findMany(findManyArgs),
      this.prisma.member.count({ where: findManyArgs.where }),
    ]);

    const itemsWithSubs = await Promise.all(
      items.map(async (m) => {
        return {
          ...m,
          self_agents: await this.prisma
            .$queryRaw<Member[]>(getAllSubsById(m.id, 'AGENT'))
            .then((arr) => arr.filter((t) => t.parent_id === m.id)),
          all_agents: await this.prisma.$queryRaw(
            getAllSubsById(m.id, 'AGENT'),
          ),
          all_players: await this.prisma.$queryRaw(
            getAllSubsById(m.id, 'PLAYER'),
          ),
        };
      }),
    );

    return {
      items: itemsWithSubs,
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
