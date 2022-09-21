import { OgResBase } from './base';

export interface OgGetBalanceReq {
  username: string;
}

export type OgGetBalanceRes = OgResBase<{ balance: string }>;
