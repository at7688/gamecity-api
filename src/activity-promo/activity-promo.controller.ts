import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ActivityPromoService } from './activity-promo.service';
import { CreateActivityPromoDto } from './dto/create-activity-promo.dto';
import { UpdateActivityPromoDto } from './dto/update-activity-promo.dto';

@Controller('activity-promo')
export class ActivityPromoController {
  constructor(private readonly activityPromoService: ActivityPromoService) {}

  @Post()
  create(@Body() createActivityPromoDto: CreateActivityPromoDto) {
    return this.activityPromoService.create(createActivityPromoDto);
  }

  @Get()
  findAll() {
    return this.activityPromoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityPromoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActivityPromoDto: UpdateActivityPromoDto,
  ) {
    return this.activityPromoService.update(id, updateActivityPromoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityPromoService.remove(id);
  }
}
