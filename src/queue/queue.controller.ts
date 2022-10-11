import { Body, Controller, Get, Post } from '@nestjs/common';
import { SearchQueueDto } from './dto/search-queue.dto';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('list')
  getPromotionQueue(@Body() data: SearchQueueDto) {
    return this.queueService.getQueue(data);
  }
}
