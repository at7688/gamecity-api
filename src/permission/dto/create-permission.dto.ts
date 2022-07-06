import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsString()
  controller: string;

  @IsString()
  handler: string;
}
