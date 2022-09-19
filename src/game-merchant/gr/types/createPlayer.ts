import { GrResBase } from './base';

export interface GrCreatePlayerReq {
  account: string;
  display_name: string;
  site_code: string;
}

export type GrCreatePlayerRes = GrResBase<{
  account: string;
  display_name: string;
  currency_type: string;
  create_time: Date;
}>;