import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RoleInterceptor } from 'src/interceptors/role.interceptor';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';

@Module({
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RoleInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
})
export class RoleModule {}
