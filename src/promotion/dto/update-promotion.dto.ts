import { PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ApprovalType, SettlementType } from '../enums';
import { CreatePromotionDto, GameWaterItem } from './create-promotion.dto';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {
  @Exclude()
  approval_type: ApprovalType;

  @Exclude()
  settlement_type: SettlementType; // 結算時間

  @Exclude()
  game_water?: GameWaterItem[];
}
