import { OgResBase } from './base';

export interface OgCreatePlayerReq {
  username: string;
  nickname?: string;
}

export type OgCreatePlayerRes = OgResBase<{
  id: number;
  username: string;
  nickname: string;
  status: string;
  balance: number;
  parent: string;
  parentId: number;
  createdAt: Date;
}>;
