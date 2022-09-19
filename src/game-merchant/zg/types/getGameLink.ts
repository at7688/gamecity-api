import { ZgResBase } from './base';

export interface ZgGetGameLinkReq {
  game_id: string;
  lang: string;
  agent: string;
  account: string;
}

export interface ZgGetGameLinkRes extends ZgResBase {
  static: string;
  dynamic: string;
  token: string;
  url: string;
}
