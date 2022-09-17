import { GrResBase } from './base';

export interface GrGetPlayerSidReq {
  account: string;
}

export type GrGetPlayerSidRes = GrResBase<{
  sid: string;
  account: string;
  expire_time: Date;
  game_url: string;
}>;
