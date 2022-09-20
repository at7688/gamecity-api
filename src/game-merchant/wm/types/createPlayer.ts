import { WmResBase } from './base';

export interface WmCreatePlayerReq {
  agent: string;
  account: string;
  password: string;
}

export type WmCreatePlayerRes = WmResBase;
