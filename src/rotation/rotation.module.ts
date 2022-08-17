import { Module } from '@nestjs/common';
import { RotationService } from './rotation.service';
import { RotationController } from './rotation.controller';

@Module({
  controllers: [RotationController],
  providers: [RotationService]
})
export class RotationModule {}
