import { Body, Controller, Param, Post } from '@nestjs/common';
import { MerchantCode } from '@prisma/client';
import { ResCode } from 'src/errors/enums';
import { Public } from 'src/metas/public.meta';
import { PrismaService } from 'src/prisma/prisma.service';
import { QiyuService } from './qiyu.service';

@Controller('order')
export class MerchantOrderController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qiyuService: QiyuService,
  ) {}

  @Post('notify/:code')
  @Public()
  notify_QIYU(@Param('code') code, @Body() body) {
    switch (code) {
      case MerchantCode.QIYU:
        return this.qiyuService.notify(body);
    }
    this.prisma.error(ResCode.NOT_FOUND, '無此廠商代碼');
  }
}
