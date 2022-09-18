import { AbResBase } from './base';

export interface AbGetGameLinkReq {
  language?: string;
  gameHall?: string;
  player: string;
  returnUrl?: string;
}

export type AbGetGameLinkRes = AbResBase<{
  gameLoginUrl: string;
}>;
