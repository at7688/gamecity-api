import { ZgResBase } from './base';

export interface ZgGameListReq {
  page_index: number;
  page_size: number;
  language_type: string;
}

export type ZgGameListRes = ZgResBase<{
  site_code: string;
  game_list: ZgGame[];
  page_index: number;
  page_size: number;
  total_pages: number;
  total_elements: number;
}>;

export interface ZgGame {
  game_type: number;
  game_name: string;
  game_module_type: number;
  icons_href: ZgGameIconUrl;
  is_open: number;
}

export interface ZgGameIconUrl {
  icon_150: string;
  icon_200: string;
  icon_300: string;
}
