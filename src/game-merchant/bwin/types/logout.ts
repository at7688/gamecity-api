import { BwinResBase } from './base';

export interface BwinLogoutReq {
  player?: string;
  platformId?: string;
}

export type BwinLogoutRes = BwinResBase;
