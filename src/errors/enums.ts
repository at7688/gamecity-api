export enum ResCode {
  SUCCESS = 'OK',
  GIFT_ALREADY_RECIEVE = 'PY0031', // 禮包已領取
  APPLICANT_REJECTED = 'PY0200', // 申請未通過
  ALREADY_APPLIED = 'PY0201', // 申請待審核
  OVER_APPLY_TIMES = 'PY0202', // 已達個人申請次數上限
  OVER_APPLICANT_LIMIT = 'PY0203', // 已達申請人數上限
  PROMOTION_NOT_RUNNING = 'PY0204', // 非優惠活動期間

  VIP_LEVEL_NOT_ALLOW = 'PY0301', // 玩家等級資格不符

  EMPTY_GAME_CODE = 'PY0401', // 遊戲代號不可為空

  GAME_MERCHANT_ERR = 'PY0501', // 遊戲商回傳錯誤
  TRANS_TO_GAME_ERR = 'PY0502', // 遊戲商轉入錯誤
  TRANS_FROM_GAME_ERR = 'PY0503', // 遊戲商轉入錯誤

  DATA_DUPICATED = 'AL0100', // 資料重複(代碼/帳號)

  BALANCE_NOT_ENOUGH = 'AL0200', // 餘額不足

  NOT_FOUND = 'AL0010', // 查無紀錄

  EMPTY_VAL = 'AL0040', // 不可為空
  DB_ERR = 'AL0050', // DB錯誤
  FORMAT_ERR = 'AL0060', // 格式驗證錯誤

  EXCEPTION_ERR = 'AL9999', // 未知例外錯誤
}
