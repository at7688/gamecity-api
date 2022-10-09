export enum WebPlatform {
  PC = 1,
  MOBILE = 2,
}

export enum LangType {
  EN = 'en',
  TW = 'tw',
  CN = 'cn',
}

export enum TargetType {
  PLAYER = 1,
  AGENT = 2,
}

export enum ValidateStatus {
  UNPROCESSED = 1,
  PROCESSING = 2,
  APPROVED = 3,
  REJECTED = 4,
}

export enum DepositStatus {
  APPLYING = 1,
  PROCESSING = 2,
  FINISHED = 3,
  CANCELED = 4,
  REJECTED = 5,
  DEPRECATED = 6,
}

// 等待付款 等待審核 完成核發 取消申請 拒絕退回 已過期
