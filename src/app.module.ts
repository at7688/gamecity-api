import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnnouncementModule } from './announcement/announcement.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { OperationRecModule } from './operation-rec/operation-rec.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { MemberModule } from './member/member.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { ActivityPromoModule } from './activity-promo/activity-promo.module';
import { BannerModule } from './banner/banner.module';
import { GameModule } from './game/game.module';
import * as redisStore from 'cache-manager-redis-store';
import { ScheduleModule } from '@nestjs/schedule';
import { UploadsService } from './uploads/uploads.service';
import { UploadsController } from './uploads/uploads.controller';
import { UploadsModule } from './uploads/uploads.module';
import { InboxModule } from './inbox/inbox.module';
import { LoginRecModule } from './login-rec/login-rec.module';
import { VipModule } from './vip/vip.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AnnouncementModule,
    OperationRecModule,
    PermissionModule,
    RoleModule,
    MemberModule,
    AuthModule,
    MenuModule,
    ActivityPromoModule,
    BannerModule,
    GameModule,
    UploadsModule,
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL'),

        max: 500,
        store: redisStore,

        // Store-specific configuration:
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
    InboxModule,
    LoginRecModule,
    VipModule,
    PlayerModule,
  ],
  controllers: [AppController, UploadsController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  // exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // throw new Error('Method not implemented.');
  }
}
