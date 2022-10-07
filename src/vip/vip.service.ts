import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { endOfMonth, startOfMonth, subDays } from 'date-fns';
import { BetRecordStatus } from 'src/bet-record/enums';
import { ResCode } from 'src/errors/enums';
import { PaymentDepositStatus } from 'src/payment-deposit/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVipDto } from './dto/create-vip.dto';
import { SetGameWaterDto } from './dto/set-game-water.dto';
import { UpdateVipDto } from './dto/update-vip.dto';
import { vipCheck, VipCheckItem } from './raw/vipCheck';
import { vipList } from './raw/vipList';

@Injectable()
export class VipService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('vip')
    private readonly vipQueue: Queue<string>,
  ) {}
  create(data: CreateVipDto) {
    return this.prisma.vip.create({
      data,
    });
  }

  async findAll() {
    const records = await this.prisma.$queryRaw(vipList());
    return this.prisma.listFormat(records[0]);
  }

  async options() {
    return this.prisma.vip.findMany({
      select: { id: true, name: true },
    });
  }

  findOne(id: string) {
    return this.prisma.vip.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateVipDto) {
    return this.prisma.vip.update({
      where: { id },
      data,
    });
  }

  gameWater(data: SetGameWaterDto) {
    const { setting, vip_id } = data;
    return Promise.all(
      setting.map((t) => {
        return this.prisma.gameWater.upsert({
          select: {
            platform_code: true,
            game_code: true,
            water: true,
          },
          where: {
            platform_code_game_code_vip_id: {
              platform_code: t.platform_code,
              game_code: t.game_code,
              vip_id,
            },
          },
          create: {
            vip_id,
            platform_code: t.platform_code,
            game_code: t.game_code,
            water: t.water,
          },
          update: {
            water: t.water,
          },
        });
      }),
    );
  }

  remove(id: string) {
    return this.prisma.vip.delete({ where: { id } });
  }

  async conditionCheck() {
    const depositRecords = await this.prisma.paymentDepositRec.findMany({
      select: { id: true },
      where: {
        status: PaymentDepositStatus.FINISHED,
        created_at: {
          gte: startOfMonth(subDays(new Date(), 1)),
          lte: endOfMonth(subDays(new Date(), 1)),
        },
      },
    });

    const betRecords = await this.prisma.betRecord.findMany({
      select: { id: true },
      where: {
        status: BetRecordStatus.DONE,
        bet_at: {
          gte: startOfMonth(subDays(new Date(), 1)),
          lte: endOfMonth(subDays(new Date(), 1)),
        },
      },
    });

    const result = await this.prisma.$queryRaw<VipCheckItem[]>(
      vipCheck(
        depositRecords.map((t) => t.id),
        betRecords.map((t) => t.id),
      ),
    );

    try {
      await Promise.all(
        result.map(async (t) => {
          await this.prisma.player.update({
            where: {
              id: t.player_id,
            },
            data: {
              vip_id: t.vip_id,
            },
          });
        }),
      );
    } catch (err) {
      this.prisma.error(ResCode.EXCEPTION_ERR);
    }

    return this.prisma.success(result);
  }
  getVipQueue() {
    return this.vipQueue.getJobs(['delayed']);
  }
}
