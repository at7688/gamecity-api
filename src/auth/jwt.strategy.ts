import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { PlatformType } from '@prisma/client';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    username: string;
    sub: string; // id
    platform: PlatformType;
    iat: number;
    exp: number;
  }) {
    const { sub: id } = payload;

    if (payload.platform === PlatformType.AGENT) {
      return this.prisma.member.findUnique({
        where: { id },
      });
    }
    if (payload.platform === PlatformType.ADMIN) {
      return this.prisma.adminUser.findUnique({
        where: { id },
        include: {
          admin_role: true,
        },
      });
    }
    if (payload.platform === PlatformType.PLAYER) {
      return this.prisma.player.findUnique({
        where: { id },
      });
    }
  }
}
