import { BngResBase } from './base';

export interface BngLogoutReq {
  account_id: number;
  username: string;
}

export type BngLogoutRes = BngResBase;
