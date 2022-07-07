import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as argon2 from 'argon2';
@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ password, ...data }: CreateMemberDto) {
    const hash = await argon2.hash(password);
    return this.prisma.member.create({
      data: {
        ...data,
        password: hash,
      },
    });
  }

  findAll() {
    return this.prisma.member.findMany();
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
