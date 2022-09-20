import { BngResBase } from './base';

export interface BngCreatePlayerReq {
  account_id: number;
  username: string;
  password: string;
}

export type BngCreatePlayerRes = BngResBase;
