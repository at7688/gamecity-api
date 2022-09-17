import { BwinResBase } from './base';

export interface BwinCreatePlayerReq {
  username: string;
  nickname?: string;
}

export type BwinCreatePlayerRes = BwinResBase<{
  id: number;
  username: string;
  nickname: string;
  status: string;
  balance: number;
  parent: string;
  parentId: number;
  createdAt: Date;
}>;
