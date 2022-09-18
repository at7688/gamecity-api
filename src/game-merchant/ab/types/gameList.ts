import { AbResBase } from './base';

export interface AbGameListReq {
  type: string; // all: 全部, fish: 漁機, slot: 老虎機, coc: 街機,
  lang: string; // zh en th vi id
}

export type AbGameListRes = AbResBase<AbGame[]>;

export interface AbGame {
  id: number;
  productId: string;
  type: string;
  name: string;
  description: string;
  src: AbGameSrc;
  RTP: string;
  href: string;
  info: AbGameInfo;
}

export interface AbGameInfo {
  line: number;
  ways: number;
  reels: string;
  autoplay: boolean;
  freegame: number;
  wildSymbol: boolean;
  bonusSymbol: boolean;
  scatterSymbol: boolean;
  multiplierSymbol: boolean;
  freeSpinTriggerSymbol: boolean;
}

export interface AbGameSrc {
  image_l: string;
  image_m: string;
  image_s: string;
  background_l: string;
  background_m: string;
  background_s: string;
  icon_l: string;
  icon_m: string;
  icon_s: string;
}
