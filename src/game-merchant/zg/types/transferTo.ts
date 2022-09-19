import { ZgResBase } from './base';

export interface ZgTransferToReq {
  serial: string;
  agent: string;
  account: string;
  amount: string;
  oper_type: 1;
}

export interface ZgTransferToRes extends ZgResBase {
  trans_id: string;
  serial: string;
  balance: string;
}
