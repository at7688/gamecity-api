import { WmResBase } from './base';

export interface WmCreatePlayerReq {
  cmd: 'MemberRegister';
  user: string;
  username: string;
  password: string;
  syslang: 0 | 1;
}

export type WmCreatePlayerRes = WmResBase<string>;
