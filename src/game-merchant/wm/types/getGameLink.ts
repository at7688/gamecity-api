import { WmResBase } from './base';

export interface WmGetGameLinkReq {
  cmd: 'SigninGame';
  user: string;
  password: string;
  lang: number;
  syslang: 0 | 1;
  voice: string;
}

export type WmGetGameLinkRes = WmResBase<string>;
