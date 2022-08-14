import { Module } from '@nestjs/common';
import { InboxService } from './inbox.service';
import { InboxController } from './inbox.controller';
import { MemberService } from 'src/member/member.service';

@Module({
  controllers: [InboxController],
  providers: [InboxService, MemberService],
})
export class InboxModule {}
