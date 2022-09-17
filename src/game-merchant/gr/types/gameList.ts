import { GrResBase } from './base';

export interface GrGameListReq {
  page_index: number;
  page_size: number;
  language_type: string;
}

export type GrGameListRes = GrResBase<{
  site_code: string;
  game_list: GrGame[];
  page_index: number;
  page_size: number;
  total_pages: number;
  total_elements: number;
}>;

export interface GrGame {
  game_type: number;
  game_name: string;
  game_module_type: number;
  icons_href: GrGameIconUrl;
  is_open: number;
}

export interface GrGameIconUrl {
  icon_150: string;
  icon_200: string;
  icon_300: string;
}
