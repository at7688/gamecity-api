import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateIdentityDto {
  @IsString()
  @IsNotEmpty()
  id_card_num: string;

  @IsInt({ each: true })
  @IsNotEmpty()
  img_ids: number[];
}
