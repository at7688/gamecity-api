export interface OgBetRecordsReq {
  Operator: string;
  Key: string;
  SDate: string;
  EDate: string;
  Provider: string;
}
export type OgBetRecordsRes = OgBetRecord[];

export interface OgBetRecord {
  id: string;
  membername: string;
  gamename: string;
  bettingcode: string;
  bettingdate: Date;
  gameid: string;
  roundno: string;
  game_information: GameInformation;
  result: string;
  bet: string;
  winloseresult: string;
  bettingamount: string;
  validbet: string;
  winloseamount: string;
  balance: string;
  currency: string;
  handicap: string;
  status: string;
  gamecategory: string;
  settledate: string;
  remark: string;
  vendor_id: string;
}

export interface GameInformation {
  playerCards: string;
  bankerCards: string;
}
