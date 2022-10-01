import { Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbService } from '../ab/ab.service';
import { BngService } from '../bng/bng.service';
import { BwinService } from '../bwin/bwin.service';
import { GrService } from '../gr/gr.service';
import { OgService } from '../og/og.service';
import { WmService } from '../wm/wm.service';
import { ZgService } from '../zg/zg.service';
import { GetBalanceDto } from './dto/get-balance-dto';
import { LoginGameDto } from './dto/login-game-dto';
import { SearchBetRecordsDto } from './dto/search-bet-records';
import { SearchGameDto } from './dto/search-game-dto';
import { TransBackDto } from './dto/trans-back-dto';

@Injectable()
export class PlatformsBridgeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ab: AbService,
    private readonly bwin: BwinService,
    private readonly gr: GrService,
    private readonly zg: ZgService,
    private readonly bng: BngService,
    private readonly wm: WmService,
    private readonly og: OgService,
  ) {}

  gameHub = {
    ab: this.ab,
    bwin: this.bwin,
    gr: this.gr,
    zg: this.zg,
    bng: this.bng,
    wm: this.wm,
    og: this.og,
  };

  async getBalance(player: Player, data: GetBalanceDto) {
    const { platform_code } = data;

    const platforms = await this.prisma.gameAccount.findMany({
      where: {
        player_id: player.id,
        platform_code,
      },
    });
    const results = await Promise.all(
      platforms.map(async (t) => {
        const credit = (await this.gameHub[t.platform_code].getBalance(
          player,
        )) as number;
        await this.prisma.gameAccount.update({
          where: {
            platform_code_player_id: {
              platform_code: t.platform_code,
              player_id: player.id,
            },
          },
          data: {
            credit,
          },
        });
        return {
          platform_code: t.platform_code,
          credit,
        };
      }),
    );
    return this.prisma.success(results);
  }

  async gameList(search: SearchGameDto) {
    const { category_code, platform_code, name } = search;
    const findManyArgs: Prisma.GameFindManyArgs = {
      where: {
        category_code,
        platform_code,
        name: { contains: name },
      },
    };
    return this.prisma.listFormat({
      items: await this.prisma.game.findMany(findManyArgs),
      count: await this.prisma.game.count({ where: findManyArgs.where }),
    });
  }

  async fetchBetRecords(search: SearchBetRecordsDto) {
    const { platform_code, start_at, end_at } = search;

    const result = await this.gameHub[platform_code].fetchBetRecords(
      start_at,
      end_at,
    );

    return this.prisma.success(result);
  }

  async login(player: Player, data: LoginGameDto) {
    try {
      await this.transferBack(player, {}); // WM測試機會失敗(因為轉額上限)
      const { platform_code, game_code } = data;
      if (['ab', 'og'].includes(platform_code)) {
        return this.gameHub[platform_code].login(player);
      } else {
        return this.gameHub[platform_code].login(game_code, player);
      }
    } catch (err) {
      throw err;
    }
  }

  transferCheck(platform_code: string, trans_id: string) {
    return this.gameHub[platform_code].transferCheck(trans_id);
  }

  async transferBack(player: Player, data: TransBackDto) {
    const { platform_code } = data;
    if (platform_code) {
      return this.gameHub[platform_code].transferBack(player);
    }
    const platforms = await this.prisma.gameAccount.findMany({
      where: {
        player_id: player.id,
        credit: {
          gt: 0,
        },
      },
    });
    console.log(platforms);
    const result = await Promise.all(
      platforms.map((t) => this.gameHub[t.platform_code].transferBack(player)),
    );

    return this.prisma.success(
      platforms.map((t, i) => ({
        code: t.platform_code,
        credit: result[i].credit,
      })),
    );
  }
}
