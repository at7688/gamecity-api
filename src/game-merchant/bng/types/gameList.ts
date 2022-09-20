import { BngResBase } from './base';

export type BngGameType = 'fish' | 'table' | 'slot' | 'arcade' | 'p2p';

export interface BngGameListReq {
  account_id: number;
}

export type BngGameListRes = BngResBase<Record<BngGameType, BngGame[]>>;

export interface BngGame {
  game_vendor_name: string;
  game_code: string;
  en: string;
  tw: string;
  cn: string;
  vi?: string;
  th?: string;
  ja?: string;
  my?: string;
  maintain: boolean;
}
