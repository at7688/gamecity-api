import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: 'summer@gmail.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'aa1234' })
  password: string;
}
