import { OgResBase } from './base';

export interface OgTransferCheckReq {
  username: string;
  transferId: string;
}

export type OgTransferCheckRes = OgResBase;
