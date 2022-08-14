import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientSearchAnnouncementsDto } from './dto/client-search-announcements.dto';

@Injectable()
export class AnnouncementClientService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search: ClientSearchAnnouncementsDto) {
    const { page = 1, perpage = 10, type } = search;
    const findManyArgs: Prisma.AnnouncementFindManyArgs = {
      where: {
        is_active: true,
        type: type || undefined,
      },
      orderBy: [{ is_top: 'desc' }, { sort: 'asc' }, { start_at: 'desc' }],
      take: +perpage,
      skip: (+page - 1) * +perpage,
    };

    return this.prisma.listFormat({
      items: await this.prisma.announcement.findMany(findManyArgs),
      count: await this.prisma.announcement.count({
        where: findManyArgs.where,
      }),
      search,
    });
  }

  findOne(id: string) {
    return this.prisma.announcement.findUnique({ where: { id } });
  }
}
