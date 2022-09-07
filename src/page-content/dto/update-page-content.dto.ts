import { PartialType } from '@nestjs/swagger';
import { CreatePageContentDto } from './create-page-content.dto';

export class UpdatePageContentDto extends PartialType(CreatePageContentDto) {}
