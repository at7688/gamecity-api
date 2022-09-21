import { OgResBase } from './base';

export interface OgGetGameLinkReq {
  productId: string;
  player: string;
}

export type OgGetGameLinkRes = OgResBase<{
  url: string;
}>;
