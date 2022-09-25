export enum PromotionType {
  FIRST_RECHARGE = 10,
  NORMAL_RECHARGE = 11,
  WATER = 20,
}

export enum ApprovalType {
  MANUAL = 1,
  AUTO = 2,
}

// 活動期間
export enum ScheduleType {
  FOREVER = 0, // 無限期
  ONCE = 1, // 僅一次
  AUTO_EXTEND_A_DAY = 10, // 結束時自動延續一天
  AUTO_EXTEND_A_WEEK = 20, // 結束時自動延續一週
  AUTO_EXTEND_A_MONTH = 30, // 結束時自動延續一個月
}

// 結算時間
export enum SettlementType {
  IMMEDIATELY = 10, // 立即結算
  DAILY = 20, // 每日結算(午夜整點)
  WEEKLY = 21, // 每週結算(週日午夜整點)
  ENDING = 30, // 活動結束時結算
}

export enum RollingType {
  NOT_INCLUDE_RECHARGE = 1,
  INCLUDE_RECHARGE = 2,
}

export enum RechargeRewardType {
  AMOUNT = 1,
  PERCENTAGE = 2,
}

export enum ApplyLimitType {
  TOTAL_PERIOD = 1, // 活動期間
  EACH_SECTION = 2, // 每檔期
}

export enum PromotionStatus {
  COMMING = 1,
  RUNING = 2,
  END = 3,
}
