import { Injectable } from '@nestjs/common';
import { AdminUser, Player, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { SearchIdentitiesDto } from './dto/search-identities.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { PlayerTagType } from 'src/player/enums';
import { ResCode } from 'src/errors/enums';
import { ValidateStatus } from 'src/enums';

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
      orderBy: {
        created_at: 'desc',
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

  async findOne(id: string) {
    const result = await this.prisma.identityVerify.findUnique({
      where: { id },
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
        imgs: true,
      },
    });
    return this.prisma.success(result);
  }

  async update(id: string, data: UpdateIdentityDto, user: AdminUser) {
    const { inner_note, outter_note, status } = data;

    const record = await this.prisma.identityVerify.findUnique({
      where: { id },
    });

    // 若申請單已通過或駁回，則不可再次審核
    if (record.status > 2) {
      this.prisma.error(ResCode.ALREADY_VARIFIED, '不可重複審核');
    }

    await this.prisma.identityVerify.update({
      where: { id },
      data: {
        status,
        inner_note,
        outter_note,
        operator_id: user.id,
      },
    });
    if (status === ValidateStatus.APPROVED) {
      // 若為通過，則添加會員實名標籤
      await this.prisma.playerTag.create({
        data: {
          player_id: record.player_id,
          type: PlayerTagType.VERIFIED_ID,
        },
      });
    }
    return this.prisma.success();
  }

  remove(id: string) {
    return this.prisma.identityVerify.delete({ where: { id } });
  }
}
