import { OgResBase } from './base';

export interface OgGameListReq {
  provider: number;
  rows: number;
}

export interface OgGameListRes {
  status: string;
  data: Data;
  meta: Meta;
}

export interface Data {
  games: Game[];
}

export interface Game {
  id: number;
  name: string;
  category: Category;
  code: string;
  url: string;
  type: Type;
  provider_id: number;
}

export enum Category {
  Live = 'live',
  Table = 'table',
}

export enum Type {
  Desktop = 'desktop',
  Empty = '*',
  Mobile = 'mobile',
}

export interface Meta {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
}
