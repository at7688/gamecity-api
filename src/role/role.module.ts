import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RoleInterceptor } from 'src/interceptors/role.interceptor';

@Module({
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RoleInterceptor,
    },
  ],
})
export class RoleModule {}
