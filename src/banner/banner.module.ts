import { Module } from '@nestjs/common';
import { UploadsModule } from 'src/uploads/uploads.module';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  imports: [UploadsModule],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
