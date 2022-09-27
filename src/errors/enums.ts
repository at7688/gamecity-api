export enum ResCode {
  SUCCESS = 'OK',
  GIFT_ALREADY_RECIEVE = 'PY0031', // 禮包已領取
  APPLICANT_REJECTED = 'PY0200', // 申請未通過
  ALREADY_APPLIED = 'PY0201', // 申請待審核
  OVER_APPLY_TIMES = 'PY0202', // 已達個人申請次數上限
  OVER_APPLICANT_LIMIT = 'PY0203', // 已達申請人數上限
  PROMOTION_NOT_RUNNING = 'PY0204', // 非優惠活動期間

  VIP_LEVEL_NOT_ALLOW = 'PY0301', // 玩家等級資格不符

  BALANCE_NOT_ENOUGH = 'AL0020', // 餘額不足
  NOT_FOUND = 'AL0010', // 查無紀錄
  EMPTY_VAL = 'AL0020', // 不可為空

  FORMAT_ERROR = 'AL0099', // 格式驗證錯誤
}
