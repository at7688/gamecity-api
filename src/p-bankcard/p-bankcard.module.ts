import { Module } from '@nestjs/common';
import { PBankcardService } from './p-bankcard.service';
import { PBankcardController } from './p-bankcard.controller';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  controllers: [PBankcardController],
  providers: [PBankcardService],
})
export class PBankcardModule {}
