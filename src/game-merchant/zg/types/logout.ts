import { ZgResBase } from './base';

export interface ZgLogoutReq {
  agent: string;
  account: string;
}

export type ZgLogoutRes = ZgResBase;
