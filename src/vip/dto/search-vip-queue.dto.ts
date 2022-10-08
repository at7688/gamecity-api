import { JobStatus } from 'bull';
import { ArrayNotEmpty, IsIn, IsNotEmpty } from 'class-validator';

export class SearchVipQueueDto {
  @IsIn(['completed', 'waiting', 'active', 'delayed', 'failed', 'paused'], {
    each: true,
  })
  @ArrayNotEmpty()
  @IsNotEmpty()
  statuses?: JobStatus[];
}
