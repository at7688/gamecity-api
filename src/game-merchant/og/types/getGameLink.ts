import { OgResBase } from './base';

export interface OgGetGameLinkReq {
  key: string;
  type?: 'desktop' | 'mobile';
}

export type OgGetGameLinkRes = OgResBase<{
  url: string;
}>;
