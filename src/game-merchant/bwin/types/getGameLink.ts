import { BwinResBase } from './base';

export interface BwinGetGameLinkReq {
  productId: string;
  player: string;
}

export type BwinGetGameLinkRes = BwinResBase<{
  url: string;
}>;
