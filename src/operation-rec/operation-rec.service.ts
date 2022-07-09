import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchAuthOperationRecDto } from './dto/search-auth-operation-rec.dto';
import { SearchOperationRecDto } from './dto/search-operation-rec.dto';

@Injectable()
export class OperationRecService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: Prisma.OperationRecCreateInput) {
    return this.prisma.operationRec.create({ data });
  }

  async findAll(search: SearchOperationRecDto) {
    const { controller, target_id, user_key, page, perpage } = search;
    const findManyArgs: Prisma.OperationRecFindManyArgs = {
      where: {
        AND: [
          {
            operator: user_key
              ? {
                  OR: [{ id: user_key }, { username: user_key }],
                }
              : undefined,
            target_id,
            controller,
          },
          { controller: { not: 'AuthController' } },
        ],
      },
      include: {
        operator: {
          select: {
            id: true,
            username: true,
            nickname: true,
            admin_role: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
      take: perpage,
      skip: (page - 1) * perpage,
    };

    const [items, count] = await this.prisma.$transaction([
      this.prisma.operationRec.findMany(findManyArgs),
      this.prisma.operationRec.count({ where: findManyArgs.where }),
    ]);

    return {
      items,
      count,
      search,
    };
  }

  async findAuthAll(search: SearchAuthOperationRecDto) {
    const { user_key, page, perpage } = search;
    const findManyArgs: Prisma.OperationRecFindManyArgs = {
      where: {
        controller: { equals: 'AuthController' },
        operator: user_key
          ? {
              OR: [{ id: user_key }, { username: user_key }],
            }
          : undefined,
      },
      include: {
        operator: {
          select: {
            id: true,
            username: true,
            nickname: true,
            admin_role: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
      take: perpage,
      skip: (page - 1) * perpage,
    };

    const [items, count] = await this.prisma.$transaction([
      this.prisma.operationRec.findMany(findManyArgs),
      this.prisma.operationRec.count({ where: findManyArgs.where }),
    ]);

    return {
      items,
      count,
      search,
    };
  }

  findOne(id: number) {
    return this.prisma.operationRec.findUnique({ where: { id } });
  }
}
