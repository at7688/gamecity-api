import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as argon2 from 'argon2';
import { SearchMembersDto } from './dto/search-members.dto';
import { Member } from '@prisma/client';
import { LoginUser } from 'src/types';
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

  findAll(query: SearchMembersDto, user: LoginUser) {
    return this.prisma.member.findMany({
      where: {
        type: query.type,
        username: query.username,
        parent_id: query.parent_id || user.id,
      },
      include: { _count: true },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.member.findUnique({ where: { id } });
  }

  async update(id: string, { password, ...data }: UpdateMemberDto) {
    const hash = await argon2.hash(password);
    return this.prisma.member.update({
      where: { id },
      data: {
        ...data,
        password: hash,
      },
    });
  }

  remove(id: string) {
    return this.prisma.member.delete({ where: { id } });
  }
}
