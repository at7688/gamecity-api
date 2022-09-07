import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchBannersClientDto } from './dto/search-banners.client.dto';

@Injectable()
export class BannerClientService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search: SearchBannersClientDto) {
    const { platform, lang } = search;
    return this.prisma.banner.findMany({
      where: {
        platform,
        lang,
        is_active: true,
      },
    });
  }
}
