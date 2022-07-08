import { Permission } from '@prisma/client';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString({ each: true })
  menu_ids: string[];
}
