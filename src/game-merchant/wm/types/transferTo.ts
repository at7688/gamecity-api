import { WmResBase } from './base';

export interface WmTransferToReq {
  serial: string;
  agent: string;
  account: string;
  amount: string;
  oper_type: 1;
}

export interface WmTransferToRes extends WmResBase {
  trans_id: string;
  serial: string;
  balance: string;
}
