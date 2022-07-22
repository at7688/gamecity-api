import { AdminRole, AdminUser, Member } from '@prisma/client';

export interface SimpleMember {
  id: string;
  username: string;
  nickname: string;
  subs?: SimpleMember[];
}
export type AdminUserWithRole = AdminUser & {
  admin_role: AdminRole;
};

export type LoginUser = AdminUserWithRole | Member;
