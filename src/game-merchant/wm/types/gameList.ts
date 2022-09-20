import { WmResBase } from './base';

export interface WmGameListRes extends WmResBase {
  game_info_state_list: GameInfoStateList[];
}
export interface GameInfoStateList {
  id: string;
  type: string;
  active: boolean;
  names: WmGameNames;
}

export interface WmGameNames {
  en_us: string;
  th_th: string;
  vi_vn: string;
  zh_cn: string;
}
