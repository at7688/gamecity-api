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
  EVERY_NOON = 10, // 日延續
  EVERY_MONDAY = 20, // 週延續
  EVERY_1TH = 30, // 月延續
}

// 結算時間
export enum SettlementType {
  NORMAL = 1, // 活動結束時結算
  IMMEDIATELY = 2, // 立即結算
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
