import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as argon2 from 'argon2';
import { SearchMembersDto } from './dto/search-members.dto';
import { Member, Prisma } from '@prisma/client';
import { LoginUser } from 'src/types';
import { PaginateDto } from 'src/dto/paginate.dto';
import { getAllSubsById } from './raw/fetchAllChild';
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
    const { page, perpage, type, username, parent_id } = search;
    const default_parent_id = 'admin_role_id' in user ? null : user.id;
    const findManyArgs: Prisma.MemberFindManyArgs = {
      where: {
        type,
        username,
        parent_id: parent_id || default_parent_id,
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
          subs: await this.prisma.$queryRaw(getAllSubsById(m.id)),
        };
      }),
    );

    return {
      items: itemsWithSubs,
      count,
      search,
    };
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
