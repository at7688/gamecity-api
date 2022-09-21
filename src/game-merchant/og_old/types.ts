export enum OgTransferType {
  BETTING = 10,
  BET_RESULT = 20,
  BET_RESULT_MANUAL = 21,
  TRANSFER_IN = 30,
  TRANSFER_OUT = 31,
  PROMOTION = 40,
}

export interface OgResBase {
  resultCode: string;
  message?: string;
  data?: any;
}

export interface OgReqConfig {
  method: string;
  path: string;
  data: any;
  md5?: string;
  date?: string;
}
