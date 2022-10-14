import { GamePlatformStatus } from 'src/game-platform/enums';
import { RegisterAgentDto } from './dto/register-agent.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AgentDuty, Member, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { numToBooleanSearch } from 'src/utils';
import { CreateAgentDto } from './dto/create-agent.dto';
import { SearchAgentsDto } from './dto/search-agents.dto';
import { SetAgentDutyDto } from './dto/set-agent-duty.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AgentWithSubNum, agentWithSubNums } from './raw/agentWithSubNums';
import { getAllParents } from './raw/getAllParents';
import { getAllSubs } from './raw/getAllSubs';
import { getTreeNode, TreeNodeMember } from './raw/getTreeNode';
import { ResCode } from 'src/errors/enums';
import { TargetType } from 'src/enums';
import { MAX_LAYER_DEPTH, SITE_URL } from 'src/sys-config/consts';
@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  isAdmin = this.configService.get('PLATFORM') === 'ADMIN';

  async create(data: CreateAgentDto) {
    const {
      password,
      nickname,
      username,
      promo_code,
      parent_id,
      email,
      phone,
      invited_code,
    } = data;

    const hash = await argon2.hash(password);

    let parent:
      | (Member & {
          duty: AgentDuty;
        })
      | null;

    if (parent_id) {
      parent = await this.prisma.member.findUnique({
        where: { id: parent_id },
        include: {
          duty: true,
        },
      });
    }

    const layer = parent ? parent.layer + 1 : 1;

    const maxLayerDepth = await this.prisma.sysConfig.findUnique({
      where: {
        code: MAX_LAYER_DEPTH,
      },
    });

    const dupicatedRecord = await this.prisma.member.findUnique({
      where: {
        username,
      },
    });

    if (dupicatedRecord) {
      this.prisma.error(ResCode.DATA_DUPICATED, '帳號重複');
    }

    // 確認階層數是否超過限制
    if (layer > +maxLayerDepth.value) {
      this.prisma.error(
        ResCode.LAYER_ERR,
        `代理階層限${maxLayerDepth.value}層`,
      );
    }

    const record = await this.prisma.member.create({
      data: {
        nickname,
        username,
        password: hash,
        parent_id: parent?.id,
        layer,
        invited_code,
        promos: {
          create: {
            type: TargetType.PLAYER,
            code: promo_code || username, // 若為給promo_code 則預設帳號為推廣碼
          },
        },
        duty: {
          create: {
            fee_duty: parent?.duty.fee_duty || 100,
            promotion_duty: parent?.duty.promotion_duty || 100,
          },
        },
        contact:
          email || phone
            ? {
                create: {
                  email,
                  phone,
                },
              }
            : undefined,
      },
    });

    // 遊戲輸贏佔成：有上層代理即吃上層設定值, 無則吃預設值
    if (parent_id) {
      const gameRatios = await this.prisma.gameRatio.findMany({
        where: {
          agent_id: parent_id,
        },
      });
      await this.prisma.gameRatio.createMany({
        data: gameRatios.map((t) => ({
          ...t,
          agent_id: record.id,
        })),
      });
    } else {
      const games = await this.prisma.game.findMany();
      await this.prisma.gameRatio.createMany({
        data: games.map((t) => ({
          agent_id: record.id,
          platform_code: t.platform_code,
          game_code: t.code,
          ratio: 100,
          water: 0.5,
          water_duty: 100,
        })),
      });
    }

    return this.prisma.success();
  }

  async register(data: RegisterAgentDto) {
    const {
      password,
      nickname,
      username,
      promo_code,
      invited_code,
      phone,
      email,
    } = data;

    const invitedPromo = await this.prisma.promoCode.findFirst({
      where: {
        code: invited_code,
        type: TargetType.AGENT,
      },
      include: {
        parent: {
          select: {
            id: true,
            username: true,
            layer: true,
            duty: true,
          },
        },
      },
    });
    if (!invitedPromo) {
      this.prisma.error(ResCode.NOT_FOUND, '無此推薦碼');
    }
    const { parent } = invitedPromo;

    return this.create({
      password,
      nickname,
      username,
      promo_code,
      phone,
      email,
      parent_id: parent.id,
      invited_code,
    });
  }

  getAllSubs(id: string | null) {
    return this.prisma.$queryRaw<Member[]>(getAllSubs(id));
  }

  getAllParents(parent_id: string) {
    return this.prisma.$queryRaw<Member[]>(getAllParents(parent_id));
  }

  async findAll(search: SearchAgentsDto, user: LoginUser) {
    const {
      page,
      perpage,
      username,
      nickname,
      layers,
      parent_id,
      is_blocked,
      all,
    } = search;
    const findManyArgs: Prisma.MemberFindManyArgs = {
      where: {
        id: !this.isAdmin
          ? {
              in: (await this.getAllSubs(user.id)).map((t) => t.id),
            }
          : undefined,
        username: {
          contains: username,
        },
        nickname: {
          contains: nickname,
        },
        layer: {
          in: layers,
        },
        is_blocked: numToBooleanSearch(is_blocked),
        parent_id: {
          in: parent_id
            ? await this.getAllSubs(parent_id).then((arr) =>
                arr.map((t) => t.id).concat(parent_id),
              )
            : parent_id,
        },
      },
      take: perpage,
      skip: (page - 1) * perpage,
    };

    const parents = await this.getAllParents(parent_id);

    const _items = await this.prisma.member.findMany(findManyArgs);
    return this.prisma.listFormat({
      items: await this.prisma.$queryRaw<unknown[]>(
        agentWithSubNums(_items.map((t) => t.id)),
      ),
      count: await this.prisma.member.count({
        where: findManyArgs.where,
      }),
      search,
      extra: {
        parents:
          'admin_role_id' in user
            ? parents
            : parents.filter((t) => t.layer <= user.layer),
      },
    });
  }

  async getTreeNode(parent_id: string, user: LoginUser) {
    const default_parent_id = 'admin_role_id' in user ? null : user.id;
    const result = await this.prisma.$queryRaw<TreeNodeMember[]>(
      getTreeNode(parent_id || default_parent_id),
    );
    return this.prisma.success(result);
  }

  async findOne(id: string) {
    const result = await this.prisma.$queryRaw<AgentWithSubNum[]>(
      agentWithSubNums([id]),
    );

    const agent = result[0];
    const contact = await this.prisma.contact.findUnique({
      where: {
        agent_id: id,
      },
    });
    const promoCodes = await this.prisma.promoCode.findMany({
      where: {
        parent_id: id,
        inviter_id: null,
        type: TargetType.PLAYER,
      },
    });
    const siteUrlResult = await this.prisma.sysConfig.findUnique({
      where: {
        code: SITE_URL,
      },
    });

    const duty = await this.prisma.agentDuty.findUnique({
      where: { agent_id: id },
    });

    let parentDuty: AgentDuty;

    if (agent?.parent_id) {
      parentDuty = await this.prisma.agentDuty.findUnique({
        where: { agent_id: agent.parent_id },
      });
    }

    return this.prisma.success({
      agent,
      contact,
      promoCodes,
      siteUrl: siteUrlResult.value,
      duty,
      parentDuty,
    });
  }

  async update(id: string, { password, ...data }: UpdateMemberDto) {
    if (password) {
      const hash = await argon2.hash(password);
      return this.prisma.member.update({
        where: { id },
        data: { ...data, password: hash },
      });
    }
    return this.prisma.member.update({
      where: { id },
      data,
    });
  }

  async setDuty(data: SetAgentDutyDto) {
    const { agent_id, fee_duty, promotion_duty } = data;
    const agent = await this.prisma.member.findUnique({
      where: { id: agent_id },
    });
    const maxDuty = {
      fee: 100,
      promotion: 100,
    };
    if (agent.parent_id !== null) {
      const parentDuty = await this.prisma.agentDuty.findUnique({
        where: {
          agent_id: agent.parent_id,
        },
      });
      if (!parentDuty) {
        this.prisma.error(ResCode.FIELD_NOT_VALID, '請先設定上層負擔');
      }
      maxDuty.fee = parentDuty.fee_duty;
      maxDuty.promotion = parentDuty.promotion_duty;
    }

    if (fee_duty > maxDuty.fee) {
      this.prisma.error(
        ResCode.FIELD_NOT_VALID,
        `手續費負擔不可超過${maxDuty.fee}`,
      );
    }
    if (promotion_duty > maxDuty.promotion) {
      this.prisma.error(
        ResCode.FIELD_NOT_VALID,
        `優惠負擔不可超過${maxDuty.promotion}`,
      );
    }

    // 若有下層，需要判斷下層的設定值是否需要往下壓
    // 跑直屬下層即可，再由該層執行往下跑
    const subs = await this.prisma.member.findMany({
      where: {
        parent_id: agent.id,
      },
    });

    if (subs) {
      await Promise.all(
        subs.map(async (t) => {
          const record = await this.prisma.agentDuty.findUnique({
            where: { agent_id: t.id },
          });
          await this.setDuty({
            agent_id: t.id,
            fee_duty: Math.min(record?.fee_duty || 0, fee_duty),
            promotion_duty: Math.min(
              record?.promotion_duty || 0,
              promotion_duty,
            ),
          });
        }),
      );
    }

    await this.prisma.agentDuty.upsert({
      where: { agent_id },
      create: {
        agent_id,
        fee_duty,
        promotion_duty,
      },
      update: {
        fee_duty,
        promotion_duty,
      },
    });
    return this.prisma.success();
  }

  remove(id: string) {
    return this.prisma.member.delete({ where: { id } });
  }
}
