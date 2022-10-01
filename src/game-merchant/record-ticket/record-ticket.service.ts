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
        valid_at: {
          lt: new Date(),
        },
        expired_at: {
          gte: new Date(),
        },
      },
    });

    if (!ticket) {
      this.prisma.error(
        ResCode.OVER_FETCH_LIMIT,
        `超過搜尋次數上限(${platform_code})`,
      );
    }
    const { kept_days, max_seconds } = ticket;

    if (start <= subDays(new Date(), kept_days)) {
      this.prisma.error(
        ResCode.FETCH_RANGE_ERR,
        `僅可搜尋${kept_days}日內數據(${platform_code})`,
      );
    }

    if (end <= start) {
      this.prisma.error(
        ResCode.FETCH_RANGE_ERR,
        `搜尋時間錯誤(${platform_code})`,
      );
    }

    const diffSeconds = differenceInSeconds(end, start);

    if (diffSeconds > max_seconds) {
      this.prisma.error(
        ResCode.FETCH_RANGE_ERR,
        `最大的搜尋區間為${max_seconds}秒(${platform_code})`,
      );
    }

    await this.prisma.betRecordTicket.delete({
      where: {
        id: ticket.id,
      },
    });

    return ticket;
  }
}
