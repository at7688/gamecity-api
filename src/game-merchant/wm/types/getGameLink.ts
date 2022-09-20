import { WmResBase } from './base';

export interface WmGetGameLinkReq {
  game_id: string;
  lang: string;
  agent: string;
  account: string;
}

export interface WmGetGameLinkRes extends WmResBase {
  static: string;
  dynamic: string;
  token: string;
  url: string;
}
