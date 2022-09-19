import { ZgResBase } from './base';

export interface ZgTransferCheckReq {
  agent: string;
  account: string;
  serial: string;
}

export interface ZgTransferCheckRes extends ZgResBase {
  serial: string;
  trans_id: string;
  amount: string;
}
