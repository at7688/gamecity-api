export enum WalletRecType {
  PAYMENT_DEPOSIT = 11,
  BANK_DEPOSIT = 12,

  WITHDRAW = 21,

  TRANSFER_OUT = 31,
  TRANSFER_IN = 32,

  MANUAL_ADD = 41, // 人工加點
  MANUAL_SUB = 42, // 人工扣點

  TRANS_TO_GAME = 51,
  TRANS_FROM_GAME = 52,

  TRANS_TO_GAME_CANCELED = 53,
  TRANS_FROM_GAME_CANCELED = 54,

  BETTING = 61,
  BET_REFUND = 62,
  BET_RESULT = 63,
  GAME_GIFT = 64, // 遊戲商紅包

  GIFT_SEND = 71, // 禮包發送(代理)
  GIFT_RECIEVE = 72, // 禮包接收(會員)
  GIFT_ROLLBACK = 73, // 禮包回滾(會員)
  GIFT_BACK = 74, // 禮包退回(代理)
}

export enum WalletStatus {
  DONE = 1,
  PROCESSING = 2,
  FAILED = 3,
}
