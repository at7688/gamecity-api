import { OgResBase } from './base';

export interface OgCreatePlayerReq {
  username: string;
  country: string;
  language: string;
  fullname: string;
  email: string;
  birthdate: string;
}

export type OgCreatePlayerRes = OgResBase;
