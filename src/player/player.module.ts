import { Module } from '@nestjs/common';
import { MemberModule } from 'src/member/member.module';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
  imports: [MemberModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
