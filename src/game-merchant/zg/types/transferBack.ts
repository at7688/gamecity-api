import { ZgResBase } from './base';

export interface ZgTransferBackReq {
  serial: string;
  agent: string;
  account: string;
  amount: string;
  oper_type: 0;
}

export interface ZgTransferBackRes extends ZgResBase {
  trans_id: string;
  serial: string;
  balance: string;
}
