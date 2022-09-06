import { Exclude } from 'class-transformer';

export class IdentityClientDto {
  @Exclude()
  inner_note?: string;
}
