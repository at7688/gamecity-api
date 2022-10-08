import { IsInt, IsNotEmpty } from 'class-validator';

export class SearchCBankcardDto {
  @IsInt()
  @IsNotEmpty()
  rotation_id: number;
}
