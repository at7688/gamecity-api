import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'summer' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: 'aa1234' })
  password: string;
}
