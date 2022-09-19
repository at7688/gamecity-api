import { ZgResBase } from './base';

export interface ZgCreatePlayerReq {
  account: string;
  display_name: string;
  site_code: string;
}

export type ZgCreatePlayerRes = ZgResBase<{
  account: string;
  display_name: string;
  currency_type: string;
  create_time: Date;
}>;
