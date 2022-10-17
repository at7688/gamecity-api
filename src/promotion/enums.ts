export enum PromotionType {
  FIRST_RECHARGE = 10,
  NORMAL_RECHARGE = 11,
  WATER = 20,
}

export enum ApplyGap {
  UNLIMIT = 0,
  A_HOUR = 10,
  A_DAY = 20,
  A_WEEK = 30,
}

export enum ApprovalType {
  MANUAL = 1, // 人工審核+派發
  HALF_AUTO = 2, // 自動審+人工派發
  AUTO = 3, // 自動審核+派發
}

// 活動期間 ps: 無限期 = 自動延續
export enum ScheduleType {
  ONCE = 1, // 僅一次
  AUTO_EXTEND_A_DAY = 10, // 結束時自動延續一天
  AUTO_EXTEND_A_WEEK = 20, // 結束時自動延續一週
  AUTO_EXTEND_A_MONTH = 30, // 結束時自動延續一個月
}

// 結算時間
export enum SettlementType {
  IMMEDIATELY = 1, // 立即結算
  ENDING = 2, // 活動結束時結算
}

export enum RollingType {
  NOT_INCLUDE_RECHARGE = 1,
  INCLUDE_RECHARGE = 2,
}

export enum PromotionStatus {
  COMMING = 1,
  RUNING = 2,
  END = 3,
}
