import { AbResBase } from './base';

export interface AbCreatePlayerReq {
  agent: string;
  player?: string;
}

export type AbCreatePlayerRes = AbResBase<{
  player: string;
}>;
