import { AbResBase } from './base';

export interface AbTransferCheckReq {
  sn: string;
}

export type AbTransferCheckRes = AbResBase<{
  playerCreditBefore: number;
  playerCreditAfter: number;
  agentCreditBefore: number;
  agentCreditAfter: number;
  transferState: 0 | 1 | 2;
  transferTime: number;
}>;

/**
 * 转账的状态(transferState)
    取值
    0: 创建状态，是一个临时状态，请隔5分钟后再查看，如还是这个状态，请联系欧博客服人员。
    1: 成功
    2: 失败
 */
