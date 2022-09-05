import { BadRequestException, Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { CreateTransferDto } from './dto/createTransferDto';
import { TransferType } from './enums';

@Injectable()
export class TransferService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  async create(data: CreateTransferDto, agent: Member) {
    const {
      type,
      target_agent_id,
      target_player_id,
      amount,
      rolling_demand,
      inner_note,
      outter_note,
    } = data;

    if (agent.balance - amount < 0) {
      throw new BadRequestException('餘額不足');
    }

    const record = await this.prisma.transferRec.create({
      data: {
        type,
        source_id: agent.id,
        target_agent_id:
          type === TransferType.AGENT ? target_agent_id : undefined,
        target_player_id:
          type === TransferType.PLAYER ? target_player_id : undefined,
        amount,
        rolling_demand,
        inner_note,
        outter_note,
      },
      include: {
        source: true,
        target_player: true,
        target_agent: true,
      },
    });
    switch (type) {
      case TransferType.AGENT:
        return this.prisma.$transaction([
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
            source: `${record.source.username}(${record.source.nickname})`,
            relative_id: record.id,
          })),
        ]);
      case TransferType.PLAYER:
        return this.prisma.$transaction([
          ...(await this.walletRecService.agentCreate({
            type: WalletRecType.TRANSFER_OUT,
            agent_id: record.source_id,
            amount: -record.amount,
            source: `${record.target_player.username}(${record.target_player.nickname})`,
            relative_id: record.id,
          })),
          ...(await this.walletRecService.playerCreate({
            type: WalletRecType.TRANSFER_IN,
            player_id: record.target_player_id,
            amount: record.amount,
            source: `${record.source.username}(${record.source.nickname})`,
            relative_id: record.id,
          })),
        ]);

      default:
        break;
    }
  }
}
