import { UserService } from './../user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    sub: string;
    agent: boolean;
    iat: number;
    exp: number;
  }) {
    console.log(payload);
    if (payload.agent) {
      return this.prisma.member.findUnique({
        where: { id: payload.sub },
      });
    }
    return this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
      include: {
        admin_role: true,
      },
    });
  }
}
