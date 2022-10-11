import { JobStatus } from 'bull';
import { ArrayNotEmpty, IsIn, IsNotEmpty } from 'class-validator';

export class SearchQueueDto {
  @IsIn(['promotion', 'applicant', 'vip', 'maintenance'])
  @IsNotEmpty()
  type: string;

  @IsIn(['completed', 'waiting', 'active', 'delayed', 'failed', 'paused'], {
    each: true,
  })
  @ArrayNotEmpty()
  @IsNotEmpty()
  statuses?: JobStatus[];
}
