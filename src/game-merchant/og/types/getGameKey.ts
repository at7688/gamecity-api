import { OgResBase } from './base';

export interface OgGetGameKeyReq {
  username: string;
}

export type OgGetGameKeyRes = OgResBase<{
  key: string;
}>;
