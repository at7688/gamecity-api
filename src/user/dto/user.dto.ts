import { AdminUser as UserModal } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserDto implements Partial<UserModal> {
  @Exclude()
  password?: string;
}
