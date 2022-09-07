import { Module } from '@nestjs/common';
import { UploadsModule } from 'src/uploads/uploads.module';
import { BannerClientController } from './banner.client.controller';
import { BannerClientService } from './banner.client.service';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  imports: [UploadsModule],
  controllers: [BannerController, BannerClientController],
  providers: [BannerService, BannerClientService],
})
export class BannerModule {}
