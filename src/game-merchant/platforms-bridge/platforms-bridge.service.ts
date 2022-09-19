import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbService } from '../ab/ab.service';
import { BwinService } from '../bwin/bwin.service';
import { GrService } from '../gr/gr.service';

@Injectable()
export class PlatformsBridgeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly abService: AbService,
    private readonly bwinService: BwinService,
    private readonly grService: GrService,
  ) {}

  async transferBack(player: Player, platform?: string) {
    const _map = {
      ab: this.abService.transferBack(player),
      bwin: this.bwinService.transferBack(player),
      gr: this.grService.transferBack(player),
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
      platforms.map((t) => _map[t.platform_code]),
    );

    return {
      platforms: platforms.map((t, i) => ({
        code: t.platform_code,
        balance: result[i].balance,
      })),
    };
  }
}
