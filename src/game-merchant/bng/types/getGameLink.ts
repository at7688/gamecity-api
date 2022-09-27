import { BngResBase } from './base';

export interface BngGetGameLinkReq {
  account_id: number;
  username: string;
  password: string;
  game_code: string;
  lang: string;
}

export type BngGetGameLinkRes = BngResBase<{ game_url: string }>;
