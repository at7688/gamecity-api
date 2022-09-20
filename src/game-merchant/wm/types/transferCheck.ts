import { WmResBase } from './base';

export interface WmTransferCheckReq {
  agent: string;
  account: string;
  serial: string;
}

export interface WmTransferCheckRes extends WmResBase {
  serial: string;
  trans_id: string;
  amount: string;
}
