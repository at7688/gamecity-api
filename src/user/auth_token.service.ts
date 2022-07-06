import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthTokenService {
  constructor(private readonly prisma: PrismaService) {}
  create(user_id: string, token: string) {
    return this.prisma.authToken.create({ data: { user_id, token } });
  }

  findAll(arg?: Prisma.AuthTokenArgs) {
    return this.prisma.authToken.findMany(arg);
  }

  findOne(where: Prisma.AuthTokenWhereUniqueInput) {
    return this.prisma.authToken.findUnique({ where });
  }

  update(user_id: string, token: string) {
    return this.prisma.authToken.update({
      where: { user_id },
      data: { token },
    });
  }

  remove(where: Prisma.AuthTokenWhereUniqueInput) {
    return this.prisma.authToken.delete({ where: where });
  }
}
