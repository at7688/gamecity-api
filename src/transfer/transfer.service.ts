import { Injectable } from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import { ResCode } from 'src/errors/enums';
import { getAllSubs } from 'src/member/raw/getAllSubs';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { SearchTransfersDto } from './dto/search-transfers.dto';
import { TransferType } from './enums';

// TODO: 管端要能設定代理轉額時的洗碼設定上限

@Injectable()
export class TransferService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  async create(data: CreateTransferDto, agent: Member) {
    const { username, amount, inner_note, outter_note } = data;

    if (agent.balance - amount < 0) {
      this.prisma.error(ResCode.BALANCE_NOT_ENOUGH, '餘額不足');
    }

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
        source_id: agent.id,
        target_id: targetAgent.id,
        amount,
        inner_note,
        outter_note,
      },
      include: {
        source: true,
        target: true,
      },
    });
    await this.prisma.$transaction([
      ...(await this.walletRecService.agentCreate({
        type: WalletRecType.TRANSFER_OUT,
        agent_id: record.source_id,
        amount: -record.amount,
        source: `${record.target.username}(${record.target.nickname})`,
        relative_id: record.id,
      })),
      ...(await this.walletRecService.agentCreate({
        type: WalletRecType.TRANSFER_IN,
        agent_id: record.target_id,
        amount: record.amount,
        rolling_amount: record.amount,
        source: `${record.source.username}(${record.source.nickname})`,
        relative_id: record.id,
      })),
    ]);
    return this.prisma.success();
  }

  async findAll(search: SearchTransfersDto, agent: Member) {
    const {
      type,
      username,
      nickname,
      amount_start,
      amount_end,
      page,
      perpage,
    } = search;

    if (type === TransferType.SENT) {
      const findManyArgs: Prisma.TransferRecFindManyArgs = {
        where: {
          source_id: agent.id,
          target: {
            username: { contains: username },
            nickname: { contains: nickname },
          },
          amount: {
            gte: amount_start,
            lte: amount_end,
          },
        },
        include: {
          target: {
            select: {
              id: true,
              nickname: true,
              username: true,
              layer: true,
            },
          },
        },
        take: perpage,
        skip: (page - 1) * perpage,
      };
      return this.prisma.listFormat({
        items: await this.prisma.transferRec.findMany(findManyArgs),
        count: await this.prisma.transferRec.count({
          where: findManyArgs.where,
        }),
      });
    } else {
      const findManyArgs: Prisma.TransferRecFindManyArgs = {
        where: {
          target_id: agent.id,
          source: {
            username: { contains: username },
            nickname: { contains: nickname },
          },
          amount: {
            gte: amount_start,
            lte: amount_end,
          },
        },
        include: {
          source: {
            select: {
              id: true,
              nickname: true,
              username: true,
              layer: true,
            },
          },
        },
        take: perpage,
        skip: (page - 1) * perpage,
      };
      return this.prisma.listFormat({
        items: await this.prisma.transferRec.findMany(findManyArgs),
        count: await this.prisma.transferRec.count({
          where: findManyArgs.where,
        }),
      });
    }
  }
}
