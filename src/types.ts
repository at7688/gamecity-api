import { AdminUser, Member } from '@prisma/client';

export interface SimpleMember {
  id: string;
  username: string;
  nickname: string;
  subs?: SimpleMember[];
}

export type LoginUser = AdminUser | Member;
