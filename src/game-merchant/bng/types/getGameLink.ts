import { BngResBase } from './base';

export interface BngGetGameLinkReq {
  game_id: string;
  lang: string;
  agent: string;
  account: string;
}

export interface BngGetGameLinkRes extends BngResBase {
  static: string;
  dynamic: string;
  token: string;
  url: string;
}
