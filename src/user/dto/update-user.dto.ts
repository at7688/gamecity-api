import { PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Exclude()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
