import { BngResBase } from './base';

export interface BngTransferCheckReq {
  agent: string;
  account: string;
  serial: string;
}

export interface BngTransferCheckRes extends BngResBase {
  serial: string;
  trans_id: string;
  amount: string;
}
