export enum AbBetStatus {
  BETTING = 100,
  FAILED = 101,
  WATING_RESULT = 110,
  DONE = 111,
  REFUND = 120,
}
// 投注中	100
// 投注失败	101
// 未派彩	110
// 已派彩	111
// 退款	120
// export const AbBetTypeMap = {
//   [1001]: '庄',
//   [1002]: '闲',
//   [1003]: '和',
// };

// 庄	1001
// 闲	1002
// 和	1003
// 庄对	1006
// 闲对	1007
// 幸运6	1100
// 庄例牌	1211
// 闲例牌	1212
// 任意对子	1223
// 完美对子	1224
// 庄龙宝	1231
// 闲龙宝	1232
// 庄保险(第一次)	1301
// 庄保险(第二次)	1302
// 闲保险(第一次)	1303
// 闲保险(第二次)	1304
// 老虎	1401
// 小老虎	1402
// 大老虎	1403
// 老虎对	1404
// 老虎和	1405
// 庄4福	1501
// 闲4福	1502
// 庄4福对子	1503
// 闲4福对子	1504
// 庄家黑	1601
// 庄家红	1602
// 闲家黑	1603
// 闲家红	1604
// 无敌6	1605

export interface AbBetRecordsRes {
  resultCode: string;
  message: null;
  data: AbBetRecordsData;
}

export interface AbBetRecordsData {
  startDateTime: Date;
  endDateTime: Date;
  total: number;
  pageSize: number;
  pageNum: number;
  list: List[];
}

export interface List {
  player: string;
  betNum: number;
  betTime: Date;
  gameRoundId: number;
  betAmount: number;
  validAmount: number;
  winOrLossAmount: number;
  gameType: number;
  status: number;
  currency: string;
  betType: number;
  gameResult: string;
  exchangeRate: number;
  gameRoundEndTime: Date;
  commission: number;
  tableName: string;
  gameRoundStartTime: Date;
  gameResult2: string;
  appType: number;
  betMethod: number;
  ip: string;
  deposit: number;
}
