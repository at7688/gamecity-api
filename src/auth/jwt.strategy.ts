import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PlatformType } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
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
    switch (payload.platform) {
      case 'AGENT':
        return this.prisma.member.findUnique({
          where: { id: payload.sub },
        });
      case 'ADMIN':
        return this.prisma.adminUser.findUnique({
          where: { id: payload.sub },
          include: {
            admin_role: true,
          },
        });
      case 'PLAYER':
        return this.prisma.player.findUnique({
          where: { id: payload.sub },
        });

      default:
        break;
    }
  }
}
