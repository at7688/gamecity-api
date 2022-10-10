import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePwDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\w{5,}$/, { message: '密碼需為5個以上英數字' })
  password: string;
}
