import { BetRecordService } from './bet-record.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SearchBetRecordsDto } from './dto/search-bet-records.dto';
import { Platforms } from 'src/metas/platforms.meta';
import { PlatformType } from '@prisma/client';

@Controller('betRecord')
@Platforms([PlatformType.PLAYER])
export class BetRecordController {
  constructor(private readonly betRecordService: BetRecordService) {}

  @Post('list')
  findAll(@Body() body: SearchBetRecordsDto) {
    return this.betRecordService.findAll(body);
  }
}
