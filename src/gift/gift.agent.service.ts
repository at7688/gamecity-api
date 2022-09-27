import { Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';
import { ResCode } from 'src/errors/enums';
import { SubPlayer, subPlayers } from 'src/player/raw/subPlayers';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { GiftStatus, GiftType } from './enums';

@Injectable()
export class GiftAgentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  async create(data: CreateGiftDto, agent: Member) {
    const { username, amount, nums_rolling } = data;
    const player = await this.prisma.player.findFirst({
      where: {
        id: {
          in: (
            await this.prisma.$queryRaw<SubPlayer[]>(subPlayers(agent.id))
          ).map((t) => t.id),
        },
        username,
      },
    });
    if (!player) {
      this.prisma.error(ResCode.NOT_FOUND, '無此下線會員');
    }
    await this.prisma.gift.create({
      data: {
        type: GiftType.AGENT_SEND,
        sender_id: agent.id,
        player_id: player.id,
        amount,
        rolling_amount: amount * nums_rolling,
        status: GiftStatus.SENT,
      },
    });
    return this.prisma.success();
  }
}
