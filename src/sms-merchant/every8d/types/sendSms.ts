export interface Every8dSendSmsReq {
  SB: string; // 標題
  MSG: string; // 內文
  DEST: string; // 多組用逗號分開 ex: +886900000001,+886900000002
  ST?: string; // 預約時間；格式為 yyyyMMddHHmmss
  RETRYTIME?: string; // 有效期限；預設為 1440，單位：分鐘。
}

export type Every8dSendSmsRes = string;
