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

  async transferBack(player: Player, platform?: string) {
    const _map = {
      ab: () => this.ab.transferBack(player),
      bwin: () => this.bwin.transferBack(player),
      gr: () => this.gr.transferBack(player),
      zg: () => this.zg.transferBack(player),
      bng: () => this.bng.transferBack(player),
      wm: () => this.wm.transferBack(player),
      og: () => this.og.transferBack(player),
    };

    if (platform) {
      return _map[platform];
    }
    const platforms = await this.prisma.gameAccount.findMany({
      where: {
        player_id: player.id,
        has_credit: true,
      },
    });
    const result = await Promise.all(
      platforms.map((t) => _map[t.platform_code]()),
    );

    return {
      platforms: platforms.map((t, i) => ({
        code: t.platform_code,
        balance: result[i].balance,
      })),
    };
  }
}
