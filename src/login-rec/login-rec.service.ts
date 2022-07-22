import { SearchLoginRecsDto } from './dto/search-login-rec.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLoginRecDto } from './dto/create-login-rec.dto';
import { UpdateLoginRecDto } from './dto/update-login-rec.dto';
import { Prisma } from '@prisma/client';
import { numArrToBooleanSearch } from 'src/utils';

@Injectable()
export class LoginRecService {
  constructor(private readonly prisma: PrismaService) {}
  create(createLoginRecDto: CreateLoginRecDto) {
    return 'This action adds a new loginRec';
  }

  async findAll(search: SearchLoginRecsDto) {
    const {
      page,
      perpage,
      ip,
      username,
      nickname,
      status,
      block,
      layer,
      from_time,
      to_time,
    } = search;

    const findManyArgs: Prisma.LoginRecFindManyArgs = {
      where: {
        ip,
        admin_user_id: null,
        nums_failed: status
          ? status.includes(1) && status.includes(2)
            ? undefined
            : status.includes(1)
            ? { gte: 1 }
            : status.includes(2)
            ? { equals: 0 }
            : undefined
          : undefined,
        login_at: {
          gte: from_time ? new Date(from_time) : undefined,
          lte: to_time ? new Date(to_time) : undefined,
        },
        agent: {
          username,
          nickname,
          layer: layer
            ? {
                in: layer,
              }
            : undefined,
          OR: block
            ? [
                {
                  is_blocked: numArrToBooleanSearch(block),
                },
                {
                  login_rec: block.includes(3)
                    ? {
                        some: { nums_failed: { gte: 5 } },
                      }
                    : undefined,
                },
              ]
            : undefined,
        },
      },
      orderBy: {
        login_at: 'desc',
      },
      take: perpage,
      skip: (page - 1) * perpage,
      include: {
        agent: {
          select: {
            username: true,
            nickname: true,
            layer: true,
            is_blocked: true,
            parent: {
              select: {
                username: true,
                nickname: true,
                layer: true,
              },
            },
          },
        },
      },
    };

    return {
      items: await this.prisma.loginRec.findMany(findManyArgs),
      count: await this.prisma.loginRec.count({ where: findManyArgs.where }),
      search,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} loginRec`;
  }

  update(id: number, updateLoginRecDto: UpdateLoginRecDto) {
    return `This action updates a #${id} loginRec`;
  }

  remove(id: number) {
    return `This action removes a #${id} loginRec`;
  }
}
