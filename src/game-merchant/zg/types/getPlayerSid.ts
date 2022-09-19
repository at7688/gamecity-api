import { ZgResBase } from './base';

export interface ZgGetPlayerSidReq {
  account: string;
}

export type ZgGetPlayerSidRes = ZgResBase<{
  sid: string;
  account: string;
  expire_time: Date;
  game_url: string;
}>;
