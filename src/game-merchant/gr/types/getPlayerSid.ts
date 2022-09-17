import { GrBaseRes } from './base';

export interface GrGetPlayerSidReq {
  account: string;
}

export type GrGetPlayerSidRes = GrBaseRes<{
  sid: string;
  account: string;
  expire_time: Date;
  game_url: string;
}>;
