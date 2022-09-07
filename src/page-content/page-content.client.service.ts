import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchPageContentClientDto } from './dto/search-page-content.client.dto';

@Injectable()
export class PageContentClientService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(search: SearchPageContentClientDto) {
    const { lang, code } = search;
    return this.prisma.pageContent.findUnique({
      select: { title: true, content: true, lang: true },
      where: {
        code_lang: { lang, code },
      },
    });
  }
}
