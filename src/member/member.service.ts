import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as argon2 from 'argon2';
import { SearchMembersDto } from './dto/search-members.dto';
@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ password, ...data }: CreateMemberDto) {
    const hash = await argon2.hash(password);
    const parent = await this.prisma.member.findUnique({
      where: { id: data.parent_id },
    });
    return this.prisma.member.create({
      data: {
        ...data,
        password: hash,
        layer: parent ? ++parent.layer : 1,
      },
    });
  }

  findAll(query?: SearchMembersDto) {
    return this.prisma.member.findMany({
      where: {
        type: query.type,
        username: query.username,
        parent_id: query.parent_id,
      },
      include: { _count: true },
    });
  }

  findOne(id: string) {
    return this.prisma.member.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateMemberDto) {
    return this.prisma.member.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.member.delete({ where: { id } });
  }
}
