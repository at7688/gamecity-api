export enum WalletRecType {
  PAYMENT_DEPOSIT = 11,
  BANK_DEPOSIT = 12,

  WITHDRAW = 21,

  TRANSFER_OUT = 31,
  TRANSFER_IN = 32,

  MANUAL_ADD = 41, // 人工加點
  MANUAL_SUB = 42, // 人工扣點

  TRANSFER_TO_GAME = 51,
  TRANSFER_FROM_GAME = 52,

  BETTING = 61,
  BET_REFUND = 62,
  BET_RESULT = 63,
  GAME_GIFT = 64, // 遊戲商紅包

  GIFT_SEND = 71, // 禮包發送(代理)
  GIFT_RECIEVE = 72, // 禮包接收(會員)
  GIFT_ROLLBACK = 73, // 禮包回滾(會員)
  GIFT_BACK = 74, // 禮包退回(代理)
}

export enum WalletTargetType {
  AGENT = 1,
  PLAYER = 2,
}

export enum ManualType {
  ADD = 1,
  SUB = 2,
}
