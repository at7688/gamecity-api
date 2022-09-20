import { BngResBase } from './base';

export interface BngTransferBackReq {
  serial: string;
  agent: string;
  account: string;
  amount: string;
  oper_type: 0;
}

export interface BngTransferBackRes extends BngResBase {
  trans_id: string;
  serial: string;
  balance: string;
}
