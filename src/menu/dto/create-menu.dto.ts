import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateMenuDto implements Prisma.MenuCreateInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString({ each: true })
  permission_ids: string[];

  @IsString()
  @IsOptional()
  root_menu_id: string;
}
