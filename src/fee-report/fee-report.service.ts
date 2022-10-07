import { BadRequestException, Injectable } from '@nestjs/common';
import { ResCode } from 'src/errors/enums';
import { PaymentDepositStatus } from 'src/payment-deposit/enums';
import { SubPlayer, subPlayers } from 'src/player/raw/subPlayers';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchFeeReportDto } from './dto/search-fee-report.dto';
import { feeReport } from './raw/feeReport';

@Injectable()
export class FeeReportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search: SearchFeeReportDto) {
    const { start_at, end_at, username, agent_username, layers, parent_id } =
      search;

    let playersByAgent = null;

    if (agent_username) {
      const agent = await this.prisma.member.findUnique({
        where: { username: agent_username },
      });
      if (!agent) {
        this.prisma.error(ResCode.NOT_FOUND, '無此代理');
      }
      playersByAgent = await this.prisma.$queryRaw<SubPlayer[]>(
        subPlayers(agent.id),
      );
    }
    const records = await this.prisma.paymentDepositRec.findMany({
      where: {
        status: PaymentDepositStatus.FINISHED,
        created_at: {
          gte: start_at,
          lte: end_at,
        },
        player: {
          AND: [
            {
              username: {
                contains: username,
              },
            },
            {
              id: {
                in: playersByAgent
                  ? playersByAgent.map((t) => t.id)
                  : undefined,
              },
            },
          ],
        },
      },
    });
    const agents = await this.prisma.member.findMany({
      where: {
        username: { contains: agent_username },
        layer: {
          in: layers,
        },
        parent_id,
      },
    });
    const agent_ids = agents.map((t) => t.id);
    const record_ids = records.map((t) => t.id);
    return record_ids.length && agent_ids.length
      ? this.prisma.$queryRaw(feeReport(agent_ids, record_ids))
      : [];
  }
}
