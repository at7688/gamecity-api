import {
  BadGatewayException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { MerchantCode } from '@prisma/client';
import { Public } from 'src/metas/public.meta';
import { MerchantOrderService } from './merchant-order.service';
import { QiyuService } from './qiyu.service';

@Controller('order')
export class MerchantOrderController {
  constructor(private readonly qiyuService: QiyuService) {}

  @Post('notify/:code')
  @Public()
  notify_QIYU(@Param('code') code, @Body() body) {
    switch (code) {
      case MerchantCode.QIYU:
        return this.qiyuService.notify(body);
    }

    throw new BadGatewayException('Notify Error');
  }
}
