import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApprovalType } from 'src/promotion/enums';
import { SearchGiftsDto } from './dto/search-gifts.dto';
import { SendStatus } from './enums';

@Injectable()
export class GiftService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search: SearchGiftsDto) {
    const { promotion_id, username, nickname, vip_ids } = search;
    return this.prisma.gift.findMany({
      where: {
        promotion_id,
        player: {
          username: {
            contains: username,
          },
          nickname: {
            contains: nickname,
          },
          vip_id: {
            in: vip_ids,
          },
        },
      },
      include: {
        promotion: true,
      },
    });
  }
}
