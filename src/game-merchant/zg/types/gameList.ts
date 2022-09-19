import { ZgResBase } from './base';

export interface ZgGameListRes extends ZgResBase {
  game_info_state_list: GameInfoStateList[];
}
export interface GameInfoStateList {
  id: string;
  type: string;
  active: boolean;
  names: ZgGameNames;
}

export interface ZgGameNames {
  en_us: string;
  th_th: string;
  vi_vn: string;
  zh_cn: string;
}
