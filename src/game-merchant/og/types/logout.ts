import { OgResBase } from './base';

export interface OgLogoutReq {
  username: string;
  status: 'blocked' | 'active';
}

export type OgLogoutRes = OgResBase;
