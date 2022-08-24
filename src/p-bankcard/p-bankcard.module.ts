import { Module } from '@nestjs/common';
import { PBankcardService } from './p-bankcard.service';
import { PBankcardController } from './p-bankcard.controller';
import { UploadsModule } from 'src/uploads/uploads.module';
import { PBankcardClientService } from './p-bankcard.client.service';
import { PBankcardClientController } from './p-bankcard.client.controller';

@Module({
  imports: [UploadsModule],
  controllers: [PBankcardController, PBankcardClientController],
  providers: [PBankcardService, PBankcardClientService],
})
export class PBankcardModule {}
