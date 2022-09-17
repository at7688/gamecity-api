import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { addHours, format, subMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GameMerchantService } from '../game-merchant.service';
import { GrReqBase, GrResBase } from './types/base';
import { GrCreatePlayerReq, GrCreatePlayerRes } from './types/createPlayer';
import { GrBetRecordsRes } from './types/fetchBetRecords';
import { GrGameListReq, GrGameListRes } from './types/gameList';
import { GrGetPlayerSidReq, GrGetPlayerSidRes } from './types/getPlayerSid';
import * as qs from 'query-string';
import { GrTransferToReq, GrTransferToRes } from './types/transferTo';
import { WalletRecType } from 'src/wallet-rec/enums';
import { GrGetBalanceReq, GrGetBalanceRes } from './types/getBalance';
import { GrTransferBackReq, GrTransferBackRes } from './types/transferBack';
@Injectable()
export class GrService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'gr';
  categoryCode = 'CHESS';
  apiUrl = 'https://grtestbackend.richgaming.net';
  secretKey = 'b6723b61301bc1e51b9d627ee687646b';

  suffix = 'asg';

  async request<T extends GrResBase>(reqConfig: GrReqBase) {
    const { method, path, data } = reqConfig;

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url: path,
      headers: {
        Cookie: `secret_key=${this.secretKey};`,
      },
      data,
    };
    try {
      const res = await axios.request<T>(axiosConfig);
      console.log(res.data);
      if (res.data.status === 'N') {
        throw new BadRequestException(`${res.data.message}(${res.data.code})`);
      }
      return res.data;
    } catch (err) {
      await this.prisma.merchantLog.create({
        data: {
          merchant_code: this.platformCode,
          action: 'ERROR',
          path,
          method,
          sendData: data,
          resData: err.response.data,
        },
      });
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
    }
  }

  async createPlayer(player: Player) {
    const reqConfig: GrReqBase<GrCreatePlayerReq> = {
      method: 'POST',
      path: '/api/platform/reg_user_info',
      data: {
        account: player.username,
        display_name: player.nickname,
        site_code: this.suffix,
      },
    };

    await this.request<GrCreatePlayerRes>(reqConfig);

    // 新增廠商對應遊戲帳號
    await this.prisma.gameAccount.create({
      data: {
        platform_code: this.platformCode,
        player_id: player.id,
        account: `${player.username}@${this.suffix}`,
      },
    });

    return {
      success: true,
    };
  }

  async getGameList() {
    const reqConfig: GrReqBase<GrGameListReq> = {
      method: 'POST',
      path: '/api/platform/get_agent_game_list',
      data: {
        page_index: 1,
        page_size: 100,
        language_type: 'zh_TW',
      },
    };

    const res = await this.request<GrGameListRes>(reqConfig);

    await this.prisma.game.createMany({
      data: res.data.game_list.map((t, i) => ({
        name: t.game_name,
        sort: i,
        code: t.game_type.toString(),
        platform_code: this.platformCode,
      })),
      skipDuplicates: true,
    });

    return res;
  }

  async getPlayerSid(account: string) {
    const reqConfig: GrReqBase<GrGetPlayerSidReq> = {
      method: 'POST',
      path: '/api/platform/get_sid_by_account',
      data: {
        account,
      },
    };

    const res = await this.request<GrGetPlayerSidRes>(reqConfig);

    return res.data;
  }

  async transferTo(player: Player) {
    const [walletRec] = await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.TRANSFER_TO_GAME,
        player_id: player.id,
        amount: -player.balance,
        source: this.platformCode,
      })),
    ]);

    const reqConfig: GrReqBase<GrTransferToReq> = {
      method: 'POST',
      path: '/api/platform/credit_balance_v3',
      data: {
        account: `${player.username}@${this.suffix}`,
        credit_amount: player.balance,
        order_id: walletRec.id,
      },
    };

    const res = await this.request<GrTransferToRes>(reqConfig);

    return res.data;
  }

  async transferBack(player: Player) {
    const { balance, account } = await this.getBalance(player);

    const [walletRec] = await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.TRANSFER_FROM_GAME,
        player_id: player.id,
        amount: balance,
        source: this.platformCode,
      })),
    ]);

    if (balance > 0) {
      const reqConfig: GrReqBase<GrTransferBackReq> = {
        method: 'POST',
        path: '/api/platform/debit_balance_v3',
        data: {
          account,
          debit_amount: balance,
          order_id: walletRec.id,
        },
      };

      await this.request<GrTransferBackRes>(reqConfig);
    }

    return {
      success: true,
      balance, // 轉回的餘額
    };
  }

  async login(game_id: string, player: Player) {
    const gameAcc = await this.prisma.gameAccount.findUnique({
      where: {
        platform_code_player_id: {
          platform_code: this.platformCode,
          player_id: player.id,
        },
      },
    });

    if (!gameAcc) {
      await this.createPlayer(player);
    }

    const account = `${player.username}@${this.suffix}`;
    const { game_url, sid } = await this.getPlayerSid(account);

    const query = qs.stringify({ sid, game_type: game_id });

    const currentPlayer = await this.prisma.player.findUnique({
      where: { id: player.id },
    });

    if (currentPlayer.balance) {
      await this.transferTo(currentPlayer);
    }

    return {
      path: `${game_url}?${query}`,
    };
  }

  async getBalance(player: Player) {
    const reqConfig: GrReqBase<GrGetBalanceReq> = {
      method: 'POST',
      path: '/api/platform/get_balance',
      data: {
        account: `${player.username}@${this.suffix}`,
      },
    };
    const res = await this.request<GrGetBalanceRes>(reqConfig);
    return res.data;
  }

  async fetchBetRecords(start: Date) {
    const reqConfig: GrReqBase = {
      method: 'POST',
      path: '/PagingQueryBetRecords',
      data: {
        startDateTime: format(start, 'yyyy-MM-dd HH:mm:ss'),
        endDateTime: format(addHours(start, 1), 'yyyy-MM-dd HH:mm:ss'),
        pageSize: 1000,
        pageNum: 1,
      },
    };

    const res = await this.request(reqConfig);

    return res;
  }
  async fetchBetRecord(bet_no: string) {
    const reqConfig: GrReqBase = {
      method: 'POST',
      path: '/QueryBetRecordByBetNum',
      data: {
        betNum: bet_no,
      },
    };

    return this.request(reqConfig);
  }
}
