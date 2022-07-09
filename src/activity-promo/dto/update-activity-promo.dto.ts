import { PartialType } from '@nestjs/swagger';
import { CreateActivityPromoDto } from './create-activity-promo.dto';

export class UpdateActivityPromoDto extends PartialType(CreateActivityPromoDto) {}
