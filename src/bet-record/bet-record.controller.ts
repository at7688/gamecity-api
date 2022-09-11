import { BetRecordService } from './bet-record.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SearchBetRecordsDto } from './dto/search-bet-records.dto';

@Controller('bet-records')
export class BetRecordController {
  constructor(private readonly betRecordService: BetRecordService) {}

  @Post()
  findAll(@Body() body: SearchBetRecordsDto) {
    return this.betRecordService.findAll(body);
  }
}
