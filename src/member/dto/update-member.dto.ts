import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @Exclude()
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
