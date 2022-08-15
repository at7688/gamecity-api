import { Module } from '@nestjs/common';
import { MemberModule } from 'src/member/member.module';
import { InboxController } from './inbox.controller';
import { InboxService } from './inbox.service';

@Module({
  imports: [MemberModule],
  controllers: [InboxController],
  providers: [InboxService],
})
export class InboxModule {}
