import { ManualType, WalletRecType } from 'src/wallet-rec/enums';
import { ManualOperationDto } from './dto/manual-operation.dto';
import { Injectable } from '@nestjs/common';
import * as numeral from 'numeral';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletRecDto } from './dto/create-wallet-rec.dto';
import { WalletTargetType } from './enums';
import { AdminUser } from '@prisma/client';

@Injectable()
export class WalletRecService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.walletRec.findMany();
  }

  async manualOperation(data: ManualOperationDto, user: AdminUser) {
    const {
      type,
      target_type,
      amount,
      note,
      player_id,
      agent_id,
      rolling_amount,
    } = data;
    switch (target_type) {
      case WalletTargetType.AGENT:
        await this.prisma.$transaction(
          await this.agentCreate({
            type:
              type === ManualType.ADD
                ? WalletRecType.MANUAL_ADD
                : WalletRecType.MANUAL_SUB,
            agent_id,
            amount: type === ManualType.ADD ? amount : -amount,
            source: '',
            operator_id: user.id,
            rolling_amount,
            note,
          }),
        );
        break;
      case WalletTargetType.PLAYER:
        await this.prisma.$transaction(
          await this.playerCreate({
            type:
              type === ManualType.ADD
                ? WalletRecType.MANUAL_ADD
                : WalletRecType.MANUAL_SUB,
            player_id,
            amount: type === ManualType.ADD ? amount : -amount,
            source: '',
            operator_id: user.id,
            rolling_amount,
            note,
          }),
        );
        break;
      default:
        break;
    }
    return this.prisma.success();
  }

  async playerCreate(data: CreateWalletRecDto) {
    const {
      type,
      player_id,
      rolling_amount,
      amount,
      source,
      fee = 0,
      operator_id,
      note,
      relative_id,
    } = data;
    const player = await this.prisma.player.findUnique({
      where: { id: player_id },
    });
    return [
      this.prisma.walletRec.create({
        data: {
          type,
          player_id,
          amount,
          origin_balance: player.balance,
          result_balance: numeral(player.balance).add(amount).value(),
          source,
          fee,
          operator_id,
          note,
          relative_id,
          rolling_amount,
        },
      }),
      this.prisma.player.update({
        where: { id: player_id },
        data: {
          balance: {
            set: numeral(player.balance).add(amount).subtract(fee).value(),
          },
        },
      }),
    ];
  }
  async agentCreate(data: CreateWalletRecDto) {
    const {
      type,
      agent_id,
      amount,
      source,
      fee = 0,
      operator_id,
      note,
      relative_id,
    } = data;
    const agent = await this.prisma.member.findUnique({
      where: { id: agent_id },
    });
    return [
      this.prisma.walletRec.create({
        data: {
          type,
          agent_id,
          amount,
          origin_balance: agent.balance,
          result_balance: numeral(agent.balance).add(amount).value(),
          source,
          fee,
          operator_id,
          note,
          relative_id,
        },
      }),
      this.prisma.member.update({
        where: { id: agent_id },
        data: {
          balance: {
            set: numeral(agent.balance).add(amount).subtract(fee).value(),
          },
        },
      }),
    ];
  }
}
