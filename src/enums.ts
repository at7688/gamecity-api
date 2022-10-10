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
  APPROVED = 10,
  REJECTED = 20,
}

export enum ProcessStatus {
  UNPROCESSED = 1,
  PROCESSING = 2,
  FINISHED = 10,
  REJECTED = 20,
  CANCELED = 21,
  DEPRECATED = 22,
}

// 等待付款 等待審核 完成核發 取消申請 拒絕退回 已過期
