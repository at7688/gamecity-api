import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { ClientSearchGiftsDto } from './dto/client-search-gifts.dto';
import { GiftType, GiftStatus } from './enums';

@Injectable()
export class GiftClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  async findAll(search: ClientSearchGiftsDto, player: Player) {
    const { status } = search;
    const findManyArg: Prisma.GiftFindManyArgs = {
      where: {
        player_id: player.id,
        status,
      },
      include: {
        promotion: true,
        sender: {
          select: {
            nickname: true,
            username: true,
            id: true,
            layer: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    };
    return this.prisma.listFormat({
      items: await this.prisma.gift.findMany(findManyArg),
      count: await this.prisma.gift.count({ where: findManyArg.where }),
    });
  }

  async recieve(gift_id: string, player: Player) {
    const gift = await this.prisma.gift.findFirst({
      where: {
        id: gift_id,
        player_id: player.id,
        status: GiftStatus.SENT,
      },
      include: { promotion: true, sender: true },
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
        source:
          gift.type === GiftType.PROMOTION
            ? gift.promotion.title
            : gift.sender.username,
        relative_id: gift.id,
      })),
      this.prisma.gift.updateMany({
        where: {
          id: gift_id,
          player_id: player.id,
        },
        data: {
          status: GiftStatus.RECIEVED,
          recieved_at: new Date(),
        },
      }),
    ]);
    return this.prisma.success();
  }
}
