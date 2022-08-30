import { PartialType } from '@nestjs/swagger';
import { CreatePaywayDto } from './create-payway.dto';

export class UpdatePaywayDto extends PartialType(CreatePaywayDto) {}
