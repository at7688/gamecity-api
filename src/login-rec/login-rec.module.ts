import { Module } from '@nestjs/common';
import { LoginRecService } from './login-rec.service';
import { LoginRecController } from './login-rec.controller';

@Module({
  controllers: [LoginRecController],
  providers: [LoginRecService]
})
export class LoginRecModule {}
