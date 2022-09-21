import { OgResBase } from './base';

export interface OgTransferBackReq {
  action: 'OUT';
  username: string;
  balance: number;
  transferId: string;
}

export type OgTransferBackRes = OgResBase<{
  balance: string;
}>;
