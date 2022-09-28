import { Injectable } from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import { uniq } from 'lodash';
import { ResCode } from 'src/errors/enums';
import { SubAgent, subAgents } from 'src/player/raw/subAgents';
import { PrismaService } from 'src/prisma/prisma.service';
import { numToBooleanSearch } from 'src/utils';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { SearchPromoCode } from './dto/search-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';

@Injectable()
export class PromoCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async visit(code: string, ip: string) {
    const record = await this.prisma.promoCode.findUnique({ where: { code } });
    if (!record) {
      this.prisma.error(ResCode.NOT_FOUND, '無此推廣碼');
    }
    await this.prisma.promoCode.update({
      where: {
        code,
      },
      data: {
        ips: uniq(record.ips.concat(ip)),
      },
    });
    return this.prisma.success();
  }

  async validate(code: string) {
    const record = await this.prisma.promoCode.findUnique({ where: { code } });
    return this.prisma.success(!!record ? 'INVALID' : 'VALID');
  }

  async create(data: CreatePromoCodeDto) {
    const { code, parent_id, inviter_id, note, is_active } = data;
    const record = await this.prisma.promoCode.findUnique({ where: { code } });
    if (record) {
      this.prisma.error(ResCode.CODE_DUPICATED, '推廣碼重複');
    }
    try {
      await this.prisma.promoCode.create({
        data: {
          code,
          parent_id,
          inviter_id,
          note,
          is_active,
        },
      });
    } catch (err) {
      this.prisma.error(ResCode.DB_ERR, JSON.stringify(err));
    }

    return this.prisma.success();
  }

  async findAll(search: SearchPromoCode, agent?: Member) {
    const { parent_username, inviter_username, code, is_active } = search;
    let agents = [];
    if (agent) {
      agents = await this.prisma.$queryRaw<SubAgent[]>(subAgents(agent.id));
    }
    const findManyArgs: Prisma.PromoCodeFindManyArgs = {
      where: {
        parent: {
          id: {
            in: agent ? agents.map((t) => t.id) : undefined,
          },
          username: { contains: parent_username },
        },
        inviter: {
          username: inviter_username
            ? { contains: inviter_username }
            : undefined,
        },
        code,
        is_active: numToBooleanSearch(is_active),
      },
    };
    return this.prisma.listFormat({
      items: await this.prisma.promoCode.findMany(findManyArgs),
      count: await this.prisma.promoCode.count({ where: findManyArgs.where }),
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} promoCode`;
  }

  update(id: number, updatePromoCodeDto: UpdatePromoCodeDto) {
    return `This action updates a #${id} promoCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} promoCode`;
  }
}
