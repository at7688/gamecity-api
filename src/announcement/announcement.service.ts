import { Injectable } from '@nestjs/common';
import { AnnouncementType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { SearchAnnouncementsDto } from './dto/search-announcements.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementService {
  constructor(private readonly prisma: PrismaService) {}

  cleanBeforeDay(day: Date | string) {
    // const targetTimeStamp = new Date().setDate(new Date().getDate() + diffDays);
    return this.prisma.announcement.deleteMany({
      where: {
        end_at: {
          lt: new Date(day),
        },
      },
    });
  }

  batchCreate(list: CreateAnnouncementDto[]) {
    return this.prisma.announcement.createMany({
      data: list,
      skipDuplicates: true,
    });
  }
  injectOldList(
    oldData: {
      title: string;
      content: string;
      category: number;
      createdAt: string;
      startAt: string;
      endAt: string;
      isRedirect: boolean;
      sort: number;
      platform: number;
    }[],
  ) {
    return this.prisma.announcement.createMany({
      data: oldData.map<Prisma.AnnouncementCreateInput>((t) => ({
        title: t.title,
        content: t.content,
        type: {
          1: AnnouncementType.OPERATION,
          2: AnnouncementType.EVENT,
          3: AnnouncementType.SERVICE,
          4: AnnouncementType.GAME,
        }[t.category],
        created_at: new Date(t.createdAt),
        start_at: new Date(t.startAt),
        end_at: new Date(t.endAt),
        link: t.isRedirect ? t.content : '',
        is_new_win: t.isRedirect,
        is_top: t.sort === 0,
        sort: t.sort,
        is_active: true,
      })),
      skipDuplicates: true,
    });
  }
  create(data: CreateAnnouncementDto) {
    return this.prisma.announcement.create({ data });
  }

  async findAll(search: SearchAnnouncementsDto) {
    const { page, perpage, keyword, type, is_active } = search;
    const findManyArgs: Prisma.AnnouncementFindManyArgs = {
      where: {
        is_active: { 0: undefined, 1: true, 2: false }[is_active],
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

  findOne(id: string) {
    return this.prisma.announcement.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateAnnouncementDto) {
    return this.prisma.announcement.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.announcement.delete({ where: { id } });
  }
}
