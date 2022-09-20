import { WmResBase } from './base';

export interface WmTransferBackReq {
  serial: string;
  agent: string;
  account: string;
  amount: string;
  oper_type: 0;
}

export interface WmTransferBackRes extends WmResBase {
  trans_id: string;
  serial: string;
  balance: string;
}
