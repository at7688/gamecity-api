import { OgResBase } from './base';

export interface OgTransferToReq {
  action: 'IN';
  username: string;
  balance: number;
  transferId: string;
}

export type OgTransferToRes = OgResBase<{
  balance: string;
}>;
