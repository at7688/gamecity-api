import { BngResBase } from './base';

export interface BngTransferToReq {
  serial: string;
  agent: string;
  account: string;
  amount: string;
  oper_type: 1;
}

export interface BngTransferToRes extends BngResBase {
  trans_id: string;
  serial: string;
  balance: string;
}
