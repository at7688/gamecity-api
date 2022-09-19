import { BatchSetGameRatioDtos } from './dto/batch-set-game-ratios.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameRatioDto } from './dto/create-game-ratio.dto';
import { SearchGameRatiosDto } from './dto/search-game-ratios.dto';
import { UpdateGameRatioDto } from './dto/update-game-ratio.dto';

@Injectable()
export class GameRatioService {
  constructor(private readonly prisma: PrismaService) {}
  async batchSet(data: BatchSetGameRatioDtos) {
    const { platform_code, agent_id, ratios } = data;
    await Promise.all(
      ratios.map(({ game_code, ratio, water, water_duty }) =>
        this.set({
          platform_code,
          game_code,
          agent_id,
          ratio,
          water,
          water_duty,
        }),
      ),
    );
    return { success: true };
  }
  async set(data: CreateGameRatioDto) {
    const { game_code, platform_code, agent_id, ratio, water, water_duty } =
      data;
    // 查看上層agent的ratio
    const parent = await this.prisma.member.findFirst({
      where: {
        subs: {
          some: {
            id: agent_id,
          },
        },
      },
      select: {
        game_ratios: {
          where: {
            platform_code,
            game_code,
          },
        },
      },
    });
    const max = {
      ratio: 100,
      water_duty: 100,
      water: 1,
    };
    // 有上層代理 但未設置
    if (parent && !parent.game_ratios[0]) {
      throw new BadRequestException(`請先設定上層代理佔成 (${game_code})`);
    }
    // 有上層代理，最高不能超過該代理佔成
    if (parent && parent.game_ratios[0]) {
      const setting = parent.game_ratios[0];
      max.ratio = setting.ratio;
      max.water_duty = setting.water_duty;
      max.water = setting.water;
    }
    console.log(data);
    console.log(max);
    if (ratio > max.ratio) {
      throw new BadRequestException(
        `(${game_code})輸贏佔成不可超過${max.ratio}`,
      );
    }
    if (water_duty > max.water_duty) {
      throw new BadRequestException(
        `(${game_code})退水負擔不可超過${max.water_duty}`,
      );
    }
    if (water > max.water) {
      throw new BadRequestException(
        `(${game_code})退水紅利不可超過${max.water}`,
      );
    }

    // 設置的ratio不能高於上層agent
    return this.prisma.gameRatio.upsert({
      where: {
        platform_code_game_code_agent_id: {
          platform_code,
          game_code,
          agent_id,
        },
      },
      create: {
        platform_code,
        game_code,
        agent_id,
        ratio,
        water,
        water_duty,
      },
      update: {
        ratio,
        water,
        water_duty,
      },
    });
  }

  findAllByPlayer(agent_id: string, search: SearchGameRatiosDto) {
    const { platform_code, game_code } = search;
    return this.prisma.gameRatio.findMany({
      where: {
        platform_code,
        game_code,
        agent_id,
      },
      orderBy: [{ platform_code: 'asc' }, { game_code: 'asc' }],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} gameRatio`;
  }

  update(id: number, updateGameRatioDto: UpdateGameRatioDto) {
    return `This action updates a #${id} gameRatio`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameRatio`;
  }
}
