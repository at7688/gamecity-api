import { BngResBase } from './base';

export interface BngGameListRes extends BngResBase {
  game_info_state_list: GameInfoStateList[];
}
export interface GameInfoStateList {
  id: string;
  type: string;
  active: boolean;
  names: BngGameNames;
}

export interface BngGameNames {
  en_us: string;
  th_th: string;
  vi_vn: string;
  zh_cn: string;
}
