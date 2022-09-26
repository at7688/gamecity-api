import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbService } from '../ab/ab.service';
import { BngService } from '../bng/bng.service';
import { BwinService } from '../bwin/bwin.service';
import { GrService } from '../gr/gr.service';
import { OgService } from '../og/og.service';
import { WmService } from '../wm/wm.service';
import { ZgService } from '../zg/zg.service';
import { LoginGameDto } from './dto/login-game-dto';
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

  async login(data: LoginGameDto, player: Player) {
    const { platform_code, game_code } = data;
    return this.prisma.success(await this.gameHub[platform_code].login(player));
  }

  async transferBack(data: TransBackDto, player: Player) {
    const { platform_code } = data;
    if (platform_code) {
      return this.gameHub[platform_code].transferBack(player);
    }
    const platforms = await this.prisma.gameAccount.findMany({
      where: {
        player_id: player.id,
        has_credit: true,
      },
    });
    const result = await Promise.all(
      platforms.map((t) => this.gameHub[t.platform_code].transferBack(player)),
    );

    return this.prisma.success(
      platforms.map((t, i) => ({
        code: t.platform_code,
        balance: result[i].balance,
      })),
    );
  }
}
