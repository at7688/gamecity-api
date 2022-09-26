import { BadRequestException, Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';
import { ResCode } from 'src/errors/enums';
import { GiftType, SendStatus } from 'src/gift/enums';
import { getAllSubs } from 'src/member/raw/getAllSubs';
import { SubPlayer, subPlayers } from 'src/player/raw/subPlayers';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferType } from './enums';

// TODO: 管端要能設定代理轉額時的洗碼設定上限

@Injectable()
export class TransferService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  async create(data: CreateTransferDto, agent: Member) {
    const { type, username, amount, nums_rolling, inner_note, outter_note } =
      data;

    if (agent.balance - amount < 0) {
      this.prisma.error(ResCode.BALANCE_NOT_ENOUGH, '餘額不足');
    }

    if (type === TransferType.AGENT) {
      const subAgents = await this.prisma.$queryRaw<Member[]>(
        getAllSubs(agent.id),
      );
      const targetAgent = await this.prisma.member.findFirst({
        where: {
          id: { in: subAgents.map((t) => t.id) },
          username,
        },
      });
      if (!targetAgent) {
        this.prisma.error(ResCode.NOT_FOUND, '無此下線');
      }
      const record = await this.prisma.transferRec.create({
        data: {
          type,
          source_id: agent.id,
          target_agent_id:
            type === TransferType.AGENT ? targetAgent.id : undefined,
          amount,
          nums_rolling,
          inner_note,
          outter_note,
        },
        include: {
          source: true,
          target_agent: true,
        },
      });
      await this.prisma.$transaction([
        ...(await this.walletRecService.agentCreate({
          type: WalletRecType.TRANSFER_OUT,
          agent_id: record.source_id,
          amount: -record.amount,
          source: `${record.target_agent.username}(${record.target_agent.nickname})`,
          relative_id: record.id,
        })),
        ...(await this.walletRecService.agentCreate({
          type: WalletRecType.TRANSFER_IN,
          agent_id: record.target_agent_id,
          amount: record.amount,
          rolling_amount: record.amount * record.nums_rolling,
          source: `${record.source.username}(${record.source.nickname})`,
          relative_id: record.id,
        })),
      ]);
      return this.prisma.success();
    } else if (type === TransferType.PLAYER) {
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
      const record = await this.prisma.transferRec.create({
        data: {
          type,
          source_id: agent.id,
          target_player_id:
            type === TransferType.PLAYER ? player.id : undefined,
          amount,
          nums_rolling,
          inner_note,
          outter_note,
        },
        include: {
          source: true,
          target_player: true,
        },
      });

      await this.prisma.$transaction([
        ...(await this.walletRecService.agentCreate({
          type: WalletRecType.TRANSFER_OUT,
          agent_id: record.source_id,
          amount: -record.amount,
          source: `${record.target_player.username}(${record.target_player.nickname})`,
          relative_id: record.id,
        })),
        this.prisma.gift.create({
          data: {
            type: GiftType.TRANSFER,
            sender_id: agent.id,
            player_id: record.target_player_id,
            amount: record.amount,
            rolling_amount: record.amount * record.nums_rolling,
            status: SendStatus.SENT,
          },
        }),
      ]);
      return this.prisma.success();
    }
  }
}
