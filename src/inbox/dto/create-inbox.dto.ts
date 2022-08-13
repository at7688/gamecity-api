import { InboxSendType, Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInboxDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEnum(InboxSendType)
  @IsNotEmpty()
  send_type: InboxSendType;
}
