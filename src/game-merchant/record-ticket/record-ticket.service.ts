import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { differenceInSeconds, subDays } from 'date-fns';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecordTicketService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async useTicket(platform_code: string, start: Date, end: Date) {
    const ticket = await this.prisma.betRecordTicket.findFirst({
      where: {
        platform_code,
        expired_at: {
          gte: new Date(),
        },
      },
    });

    if (!ticket) {
      this.prisma.error(ResCode.OVER_FETCH_LIMIT, '超過搜尋次數上限');
    }

    if (start <= subDays(new Date(), 90)) {
      this.prisma.error(ResCode.FETCH_RANGE_ERR, '開始時間超過允許區間');
    }

    if (end <= start) {
      this.prisma.error(ResCode.FETCH_RANGE_ERR, '搜尋時間錯誤');
    }

    const diffSeconds = differenceInSeconds(end, start);

    if (diffSeconds > ticket.max_range) {
      this.prisma.error(ResCode.FETCH_RANGE_ERR, '搜尋區間錯誤');
    }

    await this.prisma.betRecordTicket.delete({
      where: {
        id: ticket.id,
      },
    });

    return ticket;
  }
}
