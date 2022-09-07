import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadsService } from 'src/uploads/uploads.service';
import { numToBooleanSearch } from 'src/utils';
import { CreateBannerDto } from './dto/create-banner.dto';
import { SearchBannersDto } from './dto/search-banners.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateBannerDto) {
    const {
      platform,
      img_id,
      title,
      lang,
      link,
      is_new_win,
      is_active,
      sort,
      start_at,
      end_at,
    } = data;
    return this.prisma.banner.create({
      data: {
        platform,
        img: { connect: { id: img_id } },
        title,
        lang,
        link,
        is_new_win,
        is_active,
        sort,
        start_at,
        end_at,
      },
    });
  }

  async findAll(search: SearchBannersDto) {
    const { platform, lang, title, is_active, page, perpage } = search;
    const findManyArgs: Prisma.BannerFindManyArgs = {
      where: {
        platform,
        lang,
        title: { contains: title },
        is_active: numToBooleanSearch(is_active),
      },
      take: perpage,
      skip: (page - 1) * perpage,
    };
    return this.prisma.listFormat({
      items: await this.prisma.banner.findMany(findManyArgs),
      count: await this.prisma.banner.count({ where: findManyArgs.where }),
    });
  }

  findOne(id: string) {
    return this.prisma.banner.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateBannerDto) {
    return this.prisma.banner.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.banner.delete({ where: { id } });
  }
}
