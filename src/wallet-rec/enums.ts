export enum WalletRecType {
  PAYMENT_DEPOSIT = 1,
  BANK_DEPOSIT = 2,
  WITHDRAW = 3,
  TRANSFER_OUT = 4,
  TRANSFER_IN = 5,
  BETTING = 6,
  GAME_REFOUND = 7,
  WIN_LOSE = 8,

  MANUAL_ADD = 9, // 人工加點
  MANUAL_SUB = 10, // 人工扣點
}

export enum WalletTargetType {
  AGENT = 1,
  PLAYER = 2,
}

export enum ManualType {
  ADD = 1,
  SUB = 2,
}
