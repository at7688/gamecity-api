import { IdentityClientController } from './identity.client.controller';
import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { UploadsModule } from 'src/uploads/uploads.module';
import { IdentityClientService } from './identity.client.service';

@Module({
  imports: [UploadsModule],
  controllers: [IdentityController, IdentityClientController],
  providers: [IdentityService, IdentityClientService],
})
export class IdentityModule {}
