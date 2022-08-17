import { PartialType } from '@nestjs/swagger';
import { CreatePBankcardDto } from './create-p-bankcard.dto';

export class UpdatePBankcardDto extends PartialType(CreatePBankcardDto) {}
