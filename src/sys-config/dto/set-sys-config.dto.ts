import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SetSysConfigDto {
  @IsString()
  @IsNotEmpty()
  phone_code_template: string;

  @IsString()
  @IsNotEmpty()
  sms_merchant: string;

  @IsInt()
  @IsNotEmpty()
  agent_gift_max_rolling: number;

  @IsInt()
  @IsNotEmpty()
  phone_code_expired_minutes: number;

  @IsString({ each: true })
  @IsNotEmpty()
  register_required: string[];

  @IsIn(['yes', 'no'])
  @IsNotEmpty()
  admin_multi_login: 'yes' | 'no';

  @IsIn(['yes', 'no'])
  @IsNotEmpty()
  agent_multi_login: 'yes' | 'no';

  @IsInt()
  @IsNotEmpty()
  max_layer_depth: number;

  @IsInt()
  @IsNotEmpty()
  failed_login_limit: number;
}
