import { Member } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class MemberDto implements Partial<Member> {
  @Exclude()
  password?: string;
}
