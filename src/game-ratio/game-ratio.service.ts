import { BatchSetGameRatioDtos } from './dto/batch-set-game-ratios.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGameRatioDto } from './dto/create-game-ratio.dto';
import { SearchGameRatiosDto } from './dto/search-game-ratios.dto';
import { UpdateGameRatioDto } from './dto/update-game-ratio.dto';
import { ResCode } from 'src/errors/enums';
import { getAllSubs } from 'src/member/raw/getAllSubs';

@Injectable()
export class GameRatioService {
  constructor(private readonly prisma: PrismaService) {}
  async batchSet(data: BatchSetGameRatioDtos) {
    const { agent_id, setting } = data;

    await Promise.all(
      setting.map(({ platform_code, game_code, ratio, water, water_duty }) =>
        this.set(
          {
            platform_code,
            game_code,
            agent_id,
            ratio,
            water,
            water_duty,
          },
          true,
        ),
      ),
    );
    await Promise.all(
      setting.map(({ platform_code, game_code, ratio, water, water_duty }) =>
        this.set(
          {
            platform_code,
            game_code,
            agent_id,
            ratio,
            water,
            water_duty,
          },
          false,
        ),
      ),
    );

    return this.prisma.success();
  }

  async set(data: CreateGameRatioDto, is_check: boolean) {
    const { game_code, platform_code, agent_id, ratio, water, water_duty } =
      data;
    const game = await this.prisma.game.findFirst({
      where: {
        platform_code,
        code: game_code,
      },
    });
    if (!game) {
      this.prisma.error(
        ResCode.NOT_FOUND,
        `無此遊戲(${platform_code}/${game_code})`,
      );
    }
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
      this.prisma.error(
        ResCode.FIELD_NOT_VALID,
        `請先設定上層代理佔成 (${game.name})`,
      );
    }
    // 有上層代理，最高不能超過該代理佔成
    if (parent && parent.game_ratios[0]) {
      const setting = parent.game_ratios[0];
      max.ratio = setting.ratio;
      max.water_duty = setting.water_duty;
      max.water = setting.water;
    }

    if (ratio > max.ratio) {
      this.prisma.error(
        ResCode.FIELD_NOT_VALID,
        `(${game.name})輸贏佔成不可超過${max.ratio}`,
      );
    }
    if (water_duty > max.water_duty) {
      this.prisma.error(
        ResCode.FIELD_NOT_VALID,
        `(${game.name})退水負擔不可超過${max.water_duty}`,
      );
    }
    if (water > max.water) {
      this.prisma.error(
        ResCode.FIELD_NOT_VALID,
        `(${game.name})退水紅利不可超過${max.water}`,
      );
    }

    // 若有下層，需要判斷下層的設定值是否需要往下壓
    // 跑直屬下層即可，再由該層執行往下跑
    const subs = await this.prisma.member.findMany({
      where: { parent_id: agent_id },
      include: {
        game_ratios: {
          where: {
            platform_code,
            game_code,
          },
        },
      },
    });

    if (subs) {
      await Promise.all(
        subs.map(async (t) => {
          const _setting = t.game_ratios[0];
          if (!_setting) return;
          await this.set(
            {
              agent_id: t.id,
              platform_code,
              game_code,
              ratio: Math.min(_setting.ratio || 0, ratio),
              water: Math.min(_setting.water || 0, water),
              water_duty: Math.min(_setting.water_duty || 0, water_duty),
            },
            false,
          );
        }),
      );
    }

    // 若不為驗證模式，則送出更新
    if (!is_check) {
      await this.prisma.gameRatio.upsert({
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
  }

  async findAll(search: SearchGameRatiosDto) {
    const { agent_id, platform_code, game_code } = search;
    const result = await this.prisma.gameRatio.findMany({
      where: {
        platform_code,
        game_code,
        agent_id,
      },
      orderBy: [{ platform_code: 'asc' }, { game_code: 'asc' }],
    });
    return this.prisma.success(result);
  }
}
