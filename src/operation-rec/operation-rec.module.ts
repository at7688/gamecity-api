import { Global, Module } from '@nestjs/common';
import { OperationRecService } from './operation-rec.service';
import { OperationRecController } from './operation-rec.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OperationInterceptor } from 'src/interceptors/operation.interceptor';

@Global()
@Module({
  controllers: [OperationRecController],
  providers: [
    OperationRecService,
    {
      provide: APP_INTERCEPTOR,
      useClass: OperationInterceptor,
    },
  ],
  exports: [OperationRecService],
})
export class OperationRecModule {}
