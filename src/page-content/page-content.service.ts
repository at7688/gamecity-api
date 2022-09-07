import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePageContentDto } from './dto/create-page-content.dto';
import { SearchPageContentsDto } from './dto/search-page-contents.dto';
import { UpdatePageContentDto } from './dto/update-page-content.dto';

@Injectable()
export class PageContentService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreatePageContentDto) {
    const { code, lang, title, content } = data;
    return this.prisma.pageContent.create({
      data: {
        code,
        lang,
        title,
        content,
      },
    });
  }

  findAll(search: SearchPageContentsDto) {
    const { code, lang } = search;
    return this.prisma.pageContent.findMany({
      where: {
        code,
        lang,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.pageContent.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, data: UpdatePageContentDto) {
    const { code, lang, title, content } = data;
    return this.prisma.pageContent.update({
      where: { id },
      data: {
        code,
        lang,
        title,
        content,
      },
    });
  }
}
