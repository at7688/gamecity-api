import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString({ each: true })
  menu_ids: string[];
}
