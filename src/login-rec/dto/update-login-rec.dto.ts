import { PartialType } from '@nestjs/swagger';
import { CreateLoginRecDto } from './create-login-rec.dto';

export class UpdateLoginRecDto extends PartialType(CreateLoginRecDto) {}
