import { Every8dResBase } from './base';

export interface Every8dGetTokenReq {
  HandlerType: number;
  VerifyType: number;
  UID: string;
  PWD: string;
}

export type Every8dGetTokenRes = Every8dResBase;
