import { Module } from '@nestjs/common';
import { AnnouncementClientController } from './announcement.client.controller';
import { AnnouncementClientService } from './announcement.client.service';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';

@Module({
  controllers: [AnnouncementController, AnnouncementClientController],
  providers: [AnnouncementService, AnnouncementClientService],
})
export class AnnouncementModule {}
