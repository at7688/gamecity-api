import { RegisterAgentDto } from './dto/register-agent.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Member, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { numToBooleanSearch } from 'src/utils';
import { CreateAgentDto } from './dto/create-agent.dto';
import { SearchAgentsDto } from './dto/search-agents.dto';
import { SetAgentDutyDto } from './dto/set-agent-duty.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { agentWithSubNums } from './raw/agentWithSubNums';
import { getAllParents } from './raw/getAllParents';
import { getAllSubs } from './raw/getAllSubs';
import { getTreeNode, TreeNodeMember } from './raw/getTreeNode';
import { ResCode } from 'src/errors/enums';
@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  isAdmin = this.configService.get('PLATFORM') === 'ADMIN';

  async create(data: CreateAgentDto, user: LoginUser) {
    const {
      password,
      nickname,
      username,
      promo_code,
      parent_id,
      email,
      phone,
    } = data;

    const hash = await argon2.hash(password);
    let parent: Member | null = null;
    if ('admin_role_id' in user) {
      if (parent_id) {
        parent = await this.prisma.member.findUnique({
          where: { id: parent_id },
        });
      }
    } else {
      if (parent_id) {
        parent = (await this.getAllSubs(user.id)).find(
          (t) => t.id === parent_id,
        );
        if (!parent) {
          throw new BadRequestException('上層錯誤');
        }
      } else {
        parent = user;
      }
    }

    return this.prisma.member.create({
      data: {
        nickname,
        username,
        password: hash,
        parent_id: parent?.id,
        layer: parent ? ++parent.layer : 1,
        promos: {
          create: {
            code: promo_code,
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
    // 確認帳號是否重複
    const record = await this.prisma.member.findUnique({
      where: {
        username,
      },
    });
    if (record) {
      this.prisma.error(ResCode.DATA_DUPICATED, '帳號不可用');
    }
    const invitedPromo = await this.prisma.promoCode.findUnique({
      where: {
        code: invited_code,
      },
      include: {
        parent: {
          select: {
            id: true,
            username: true,
            layer: true,
          },
        },
      },
    });
    if (!invitedPromo) {
      this.prisma.error(ResCode.NOT_FOUND, '無此推薦碼');
    }
    const { parent } = invitedPromo;
    const hash = await argon2.hash(password);
    try {
      await this.prisma.member.create({
        data: {
          nickname,
          username,
          password: hash,
          parent_id: parent.id,
          layer: parent ? ++parent.layer : 1,
          invited_code,
          promos: {
            create: {
              code: promo_code,
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
    } catch (err) {
      this.prisma.error(ResCode.DB_ERR, JSON.stringify(err));
    }

    return this.prisma.success();
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
          in:
            all && parent_id
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
    return this.prisma.$queryRaw<TreeNodeMember[]>(
      getTreeNode(parent_id || default_parent_id),
    );
  }

  findOne(id: string) {
    return this.prisma.member.findUnique({
      where: { id },
      include: { duty: { select: { fee_duty: true, promotion_duty: true } } },
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

  async setDuty(agent_id: string, data: SetAgentDutyDto) {
    const { fee_duty, promotion_duty } = data;
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
        throw new BadRequestException('請先設定上層負擔');
      }
      maxDuty.fee = parentDuty.fee_duty;
      maxDuty.promotion = parentDuty.promotion_duty;
    }

    if (fee_duty > maxDuty.fee) {
      throw new BadRequestException(`手續費負擔不可超過${maxDuty.fee}`);
    }
    if (promotion_duty > maxDuty.promotion) {
      throw new BadRequestException(`優惠負擔不可超過${maxDuty.promotion}`);
    }

    return this.prisma.agentDuty.upsert({
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
  }

  remove(id: string) {
    return this.prisma.member.delete({ where: { id } });
  }
}
