import { Injectable } from '@nestjs/common';
import { AdminUser, Player, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { SearchIdentitiesDto } from './dto/search-identities.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';

@Injectable()
export class IdentityService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search: SearchIdentitiesDto) {
    const { page, perpage, status, nickname, username } = search;
    const findManyArgs: Prisma.IdentityVerifyFindManyArgs = {
      where: {
        status,
        player: {
          username: { contains: username },
          nickname: { contains: nickname },
        },
      },
      include: {
        player: {
          select: {
            id: true,
            nickname: true,
            username: true,
            agent: {
              select: { id: true, nickname: true, username: true, layer: true },
            },
          },
        },
      },
      take: +perpage,
      skip: (+page - 1) * +perpage,
    };
    return this.prisma.listFormat({
      items: await this.prisma.identityVerify.findMany(findManyArgs),
      count: await this.prisma.identityVerify.count({
        where: findManyArgs.where,
      }),
    });
  }

  findOne(id: string) {
    return this.prisma.identityVerify.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateIdentityDto, user: AdminUser) {
    const { inner_note, outter_note, status } = data;
    return this.prisma.identityVerify.update({
      where: { id },
      data: {
        status,
        inner_note,
        outter_note,
        operator_id: user.id,
      },
    });
  }

  remove(id: string) {
    return this.prisma.identityVerify.delete({ where: { id } });
  }
}
