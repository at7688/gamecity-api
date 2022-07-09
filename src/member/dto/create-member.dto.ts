import { MemberType, Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto implements Prisma.MemberCreateInput {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsOptional()
  promo_code?: string;

  @IsEnum(MemberType)
  @IsNotEmpty()
  type: MemberType;

  @IsString()
  @IsOptional()
  parent_id?: string;
}
