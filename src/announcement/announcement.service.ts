import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { numToBooleanSearch } from 'src/utils';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { SearchAnnouncementsDto } from './dto/search-announcements.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAnnouncementDto) {
    await this.prisma.announcement.create({ data });
    return this.prisma.success();
  }

  async findAll(search: SearchAnnouncementsDto) {
    const { page, perpage, keyword, type, is_active } = search;
    const findManyArgs: Prisma.AnnouncementFindManyArgs = {
      where: {
        is_active: numToBooleanSearch(is_active),
        AND: [
          {
            type: type || undefined,
          },
          {
            OR: [
              { title: { contains: keyword } },
              { content: { contains: keyword } },
            ],
          },
        ],
      },
      orderBy: [{ is_top: 'desc' }, { sort: 'asc' }, { start_at: 'desc' }],
      take: perpage,
      skip: (page - 1) * perpage,
    };

    return this.prisma.listFormat({
      items: await this.prisma.announcement.findMany(findManyArgs),
      count: await this.prisma.announcement.count({
        where: findManyArgs.where,
      }),
      search,
    });
  }

  async findOne(id: string) {
    const result = await this.prisma.announcement.findUnique({ where: { id } });
    return this.prisma.success(result);
  }

  async update(id: string, data: UpdateAnnouncementDto) {
    await this.prisma.announcement.update({ where: { id }, data });
    return this.prisma.success();
  }

  async remove(id: string) {
    await this.prisma.announcement.delete({ where: { id } });
    return this.prisma.success();
  }
}
