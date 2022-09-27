import { Body, Controller, Post } from '@nestjs/common';
import { Member, PlatformType } from '@prisma/client';
import { User } from 'src/decorators/user.decorator';
import { Platforms } from 'src/metas/platforms.meta';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { SearchTransfersDto } from './dto/search-transfers.dto';
import { TransferService } from './transfer.service';

@Controller('transfers')
@Platforms([PlatformType.AGENT])
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('create')
  create(@Body() data: CreateTransferDto, @User() agent: Member) {
    return this.transferService.create(data, agent);
  }

  @Post('list')
  findAll(@Body() search: SearchTransfersDto, @User() agent: Member) {
    return this.transferService.findAll(search, agent);
  }
}
