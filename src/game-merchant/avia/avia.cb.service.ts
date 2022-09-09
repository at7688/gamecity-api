import { BadRequestException, Injectable } from '@nestjs/common';
import { MerchantCode, Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { orderBy } from 'lodash';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import * as CryptoJS from 'crypto-js';
import {
  AviaBalanceCbReq,
  AviaCbReq,
  AviaCbRes,
  AviaTransferCbReq,
  AviaTransferType,
} from './types';
import { AviaService } from './avia.service';

interface ReqConfig {
  method: string;
  url: string;
  data: any;
}

interface ResBase {
  success: 1 | 0;
  msg?: string;
  info?: any;
}

@Injectable()
export class AviaCbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly aviaService: AviaService,
  ) {}

  async transfer(data: AviaTransferCbReq, headers): Promise<AviaCbRes> {
    const isValid = await this.aviaService.signValidation(data);
    if (!isValid) {
      return {
        success: 0,
        msg: '驗證不合法',
      };
    }

    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.aviaService.platformCode,
        action: 'Transfer',
        data: { data, headers } as unknown as Prisma.InputJsonObject,
      },
    });

    const player = await this.prisma.player.findUnique({
      where: {
        username: data.UserName,
      },
    });

    if (!player) {
      return {
        success: 0,
        msg: '玩家帳號不存在',
      };
    }

    let type: WalletRecType;

    console.log(data);

    switch (data.Type) {
      case AviaTransferType.BETTING:
        type = WalletRecType.BETTING;
        await this.betting(data, player.id);
        break;
      case AviaTransferType.BET_RESULT:
        type = WalletRecType.BET_RESULT;
        await this.betResult(data, player.id);

        break;
      case AviaTransferType.PROMOTION:
        type = WalletRecType.GAME_GIFT;

        break;

      default:
        break;
    }

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type,
        player_id: player.id,
        amount: +data.Money,
        source: `avia/${data.Type}/${data.Description}`,
        relative_id: data.ID,
      })),
    ]);

    return {
      success: 1,
      msg: '',
    };
  }

  async promotion(data: AviaTransferCbReq, player_id: string) {
    //
  }

  async betResult(data: AviaTransferCbReq, player_id: string) {
    await this.prisma.betRecord.update({
      where: {
        bet_no_platform_code: {
          bet_no: data.ID,
          platform_code: this.aviaService.platformCode,
        },
      },
      data: {
        status: BetRecordStatus.DONE,
        win_lose_amount: +data.Money,
      },
    });
  }

  async betting(data: AviaTransferCbReq, player_id: string) {
    await this.prisma.betRecord.create({
      data: {
        bet_no: data.ID,
        amount: -data.Money,
        bet_at: new Date(+data.Timestamp),
        player_id,
        platform_code: this.aviaService.platformCode,
      },
    });
  }
}
