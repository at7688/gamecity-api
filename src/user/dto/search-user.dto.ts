import { User } from '@prisma/client';
import { IsBoolean, IsEmail, IsOptional } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchUserDto extends PaginateDto implements Partial<User> {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  name?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
