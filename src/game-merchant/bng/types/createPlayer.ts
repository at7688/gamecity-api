import { BngResBase } from './base';

export interface BngCreatePlayerReq {
  agent: string;
  account: string;
  password: string;
}

export type BngCreatePlayerRes = BngResBase;
