import { AdminUser } from '@prisma/client';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/dto/paginate.dto';

export class SearchUserDto extends PaginateDto implements Partial<AdminUser> {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
