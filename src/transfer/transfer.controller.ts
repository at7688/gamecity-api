import { Body, Controller, Post } from '@nestjs/common';
import { Member, PlatformType } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { CreateTransferDto } from './dto/createTransferDto';
import { TransferService } from './transfer.service';

@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @Platforms([PlatformType.AGENT])
  create(@Body() data: CreateTransferDto, @User() agent: Member) {
    return this.transferService.create(data, agent);
  }
}
