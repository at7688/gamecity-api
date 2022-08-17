import { PartialType } from '@nestjs/swagger';
import { CreateCBankcardDto } from './create-c-bankcard.dto';

export class UpdateCBankcardDto extends PartialType(CreateCBankcardDto) {}
