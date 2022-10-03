import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';
import { AnnouncementModule } from './announcement/announcement.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BankDepositModule } from './bank-deposit/bank-deposit.module';
import { BankController } from './bank/bank.controller';
import { BankService } from './bank/bank.service';
import { BannerModule } from './banner/banner.module';
import { BetRecordModule } from './bet-record/bet-record.module';
import { CBankcardModule } from './c-bankcard/c-bankcard.module';
import { ClientPayModule } from './client-pay/client-pay.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { GameAccountModule } from './game-account/game-account.module';
import { GameMerchantModule } from './game-merchant/game-merchant.module';
import { GamePlatformModule } from './game-platform/game-platform.module';
import { GameRatioModule } from './game-ratio/game-ratio.module';
import { GameReportModule } from './game-report/game-report.module';
import { GameModule } from './game/game.module';
import { IdentityModule } from './identity/identity.module';
import { InboxModule } from './inbox/inbox.module';
import { LoginRecModule } from './login-rec/login-rec.module';
import { MemberModule } from './member/member.module';
import { MenuModule } from './menu/menu.module';
import { MerchantOrderModule } from './merchant-order/merchant-order.module';
import { OperationRecModule } from './operation-rec/operation-rec.module';
import { PBankcardModule } from './p-bankcard/p-bankcard.module';
import { PageContentModule } from './page-content/page-content.module';
import { PaymentDepositModule } from './payment-deposit/payment-deposit.module';
import { PaymentMerchantModule } from './payment-merchant/payment-merchant.module';
import { PaymentToolModule } from './payment-tool/payment-tool.module';
import { PaywayModule } from './payway/payway.module';
import { PermissionModule } from './permission/permission.module';
import { PlayerModule } from './player/player.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { RotationModule } from './rotation/rotation.module';
import { TransferModule } from './transfer/transfer.module';
import { UploadsController } from './uploads/uploads.controller';
import { UploadsModule } from './uploads/uploads.module';
import { UserModule } from './user/user.module';
import { VipModule } from './vip/vip.module';
import { WalletRecModule } from './wallet-rec/wallet-rec.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { PromotionModule } from './promotion/promotion.module';
import { FeeReportModule } from './fee-report/fee-report.module';
import { GiftModule } from './gift/gift.module';
import { ApplicantModule } from './applicant/applicant.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { BullModule } from '@nestjs/bull';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { SmsMerchantModule } from './sms-merchant/sms-merchant.module';

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
    PBankcardModule,
    CBankcardModule,
    RotationModule,
    WithdrawModule,
    BankDepositModule,
    PaymentMerchantModule,
    PaymentToolModule,
    PaymentDepositModule,
    PaywayModule,
    ClientPayModule,
    MerchantOrderModule,
    WalletRecModule,
    TransferModule,
    IdentityModule,
    GamePlatformModule,
    PageContentModule,
    GameMerchantModule,
    BetRecordModule,
    GameAccountModule,
    GameRatioModule,
    GameReportModule,
    PromotionModule,
    FeeReportModule,
    GiftModule,
    ApplicantModule,
    PromoCodeModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MaintenanceModule,
    SmsMerchantModule,
  ],
  controllers: [AppController, UploadsController, BankController],

  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    BankService,
  ],
  // exports: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // throw new Error('Method not implemented.');
  }
}
