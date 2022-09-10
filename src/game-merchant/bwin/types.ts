export interface BwinBetReq {
  hash: string;
  token: string;
  amount: number;
  gameId: number;
  isTest: boolean;
  roundId: number;
  productId: string;
  transactionId: number;
  roundCreatedAt: Date;
  roundUpdatedAt: Date;
}
export interface BwinResData {
  id: number;
  username: string;
  nickname: string;
  status: string;
  balance: number;
  parent: string;
  parentId: number;
  createdAt: Date;
}

export interface BwinResBase {
  error?: any;
  data?: any;
}

// 遊戲列表
export interface BwinGameListRes {
  data: BwinGame[];
  totalSize: number;
}

export interface BwinGame {
  id: number;
  productId: string;
  type: string;
  name: string;
  description: string;
  src: BwinGameSrc;
  RTP: string;
  href: string;
  info: BwinGameInfo;
}

export interface BwinGameInfo {
  line: number;
  ways: number;
  reels: string;
  autoplay: boolean;
  freegame: number;
  wildSymbol: boolean;
  bonusSymbol: boolean;
  scatterSymbol: boolean;
  multiplierSymbol: boolean;
  freeSpinTriggerSymbol: boolean;
}

export interface BwinGameSrc {
  image_l: string;
  image_m: string;
  image_s: string;
  background_l: string;
  background_m: string;
  background_s: string;
  icon_l: string;
  icon_m: string;
  icon_s: string;
}
