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

  async tranferAllBack(player: Player) {
    const platforms = await this.prisma.gameAccount.findMany({
      where: {
        player_id: player.id,
        has_credit: true,
      },
    });
    const result = await Promise.all(
      platforms.map((t) => {
        switch (t.platform_code) {
          case 'ab':
            return this.abService.transferBack(player);
          case 'bwin':
            return this.bwinService.transferBack(player);
          case 'gr':
            return this.grService.transferBack(player);
        }
      }),
    );
    return {
      platforms: platforms.map((t, i) => ({
        code: t.platform_code,
        balance: result[i].balance,
      })),
    };
  }
}
