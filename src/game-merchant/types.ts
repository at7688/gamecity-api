import { WalletRecType } from 'src/wallet-rec/enums';

export interface BetRecordTicket {
  platform_code: string;
  expired_at: Date;
  disable_before_days: number; // 天
  max_minutes: number; // 分鐘
}

export interface TransferQueue {
  trans_id: string;
  player_id: string;
  platform_code: string;
  retryTimes: number;
}
