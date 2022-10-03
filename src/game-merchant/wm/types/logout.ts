import { WmResBase } from './base';

export interface WmLogoutReq {
  cmd: 'LogoutGame';
  user?: string;
  timestamp: number;
  syslang: 0 | 1;
}

export type WmLogoutRes = WmResBase<string>;
