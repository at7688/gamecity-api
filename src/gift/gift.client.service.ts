import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { SendStatus } from './enums';

@Injectable()
export class GiftClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  findAll(player: Player) {
    return this.prisma.gift.findMany({
      where: {
        player_id: player.id,
      },
      include: {
        promotion: true,
      },
    });
  }

  async recieve(gift_id: string, player: Player) {
    const gift = await this.prisma.gift.findFirst({
      where: {
        id: gift_id,
        player_id: player.id,
        status: SendStatus.SENT,
      },
      include: { promotion: true },
    });

    if (!gift) {
      throw this.prisma.error(
        ResCode.GIFT_ALREADY_RECIEVE,
        '無此禮包或禮包已領取',
      );
    }

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.GIFT_RECIEVE,
        player_id: player.id,
        amount: gift.amount,
        rolling_amount: gift.rolling_amount,
        source: gift.promotion.title,
        relative_id: gift.id,
      })),
      this.prisma.gift.updateMany({
        where: {
          id: gift_id,
          player_id: player.id,
        },
        data: {
          status: SendStatus.RECIEVED,
        },
      }),
    ]);
    return this.prisma.success();
  }
}
