import { ZgResBase } from './base';

export interface ZgCreatePlayerReq {
  agent: string;
  account: string;
  password: string;
}

export type ZgCreatePlayerRes = ZgResBase;
