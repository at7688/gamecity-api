import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  addSeconds,
  differenceInSeconds,
  format,
  subDays,
  subSeconds,
} from 'date-fns';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecordTicketService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async recordDate(platform_code: string, start: Date, end: Date) {
    console.log(
      `(${platform_code}) ${format(start, 'HH:mm:ss')} ~ ${format(
        end,
        'HH:mm:ss',
      )}`,
    );

    await this.cacheManager.set(`RecordEnd_${platform_code}`, end);
    await this.prisma.gamePlatform.update({
      where: { code: platform_code },
      data: {
        record_check_at: end,
      },
    });
  }

  async getOverflowRrange(platform_code: string, start: Date, end: Date) {
    // 取得最後搜尋日期
    const lastEnd = await this.cacheManager.get<Date>(
      `RecordEnd_${platform_code}`,
    );
    if (lastEnd) {
      const diffSecond = differenceInSeconds(
        new Date(start),
        new Date(lastEnd),
      );

      console.log(`(${platform_code}) 相差秒數：${diffSecond}`);
      if (diffSecond > 0) {
        start = subSeconds(start, diffSecond + 5);
        end = await this.getValidEnd(platform_code, start);
      }
    }

    return { start, end };
  }

  async getValidEnd(platform_code: string, start: Date) {
    const ticket = await this.prisma.betRecordTicket.findFirst({
      where: {
        platform_code,
        valid_at: {
          lt: new Date(),
        },
        OR: [
          {
            expired_at: {
              gte: new Date(),
            },
          },
          {
            expired_at: null,
          },
        ],
      },
    });

    if (!ticket) {
      return addSeconds(start, 60);
    }

    const distenceToNow = differenceInSeconds(new Date(), start);

    return addSeconds(start, Math.min(distenceToNow, ticket?.max_seconds));
  }

  async useTicket(
    platform_code: string,
    start: Date,
    end: Date,
    next_valid_at?: Date,
  ) {
    const ticket = await this.prisma.betRecordTicket.findFirst({
      where: {
        platform_code,
        valid_at: {
          lt: new Date(),
        },
        OR: [
          {
            expired_at: {
              gte: new Date(),
            },
          },
          {
            expired_at: null,
          },
        ],
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

    if (next_valid_at) {
      await this.prisma.betRecordTicket.update({
        where: {
          id: ticket.id,
        },
        data: {
          valid_at: next_valid_at,
        },
      });
    } else {
      await this.prisma.betRecordTicket.delete({
        where: {
          id: ticket.id,
        },
      });
    }

    return ticket;
  }
}
