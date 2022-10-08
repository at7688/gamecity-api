import { CronExpression } from '@nestjs/schedule';

// 結算時間
export enum VipCheckTime {
  WEEKLY_SUNDAY_MIDNIGHT = 'week.0.0.0', // 每週結算(週日午夜整點) 星期x/時/分
  MONTHLY_1ST_NOON = 'month.1.12.0', // 每月結算(週日午夜整點) x日/時/分
  MONTHLY_1ST_MIDNIGHT = 'month.1.0.0', // 每月結算(週日午夜整點) x日/時/分
}

// CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON
// CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT
// CronExpression.EVERY_WEEK
