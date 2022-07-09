import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Session,
  Request,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SearchAuthOperationRecDto } from './dto/search-auth-operation-rec.dto';
import { SearchOperationRecDto } from './dto/search-operation-rec.dto';
import { OperationRecService } from './operation-rec.service';

@Controller('operations')
export class OperationRecController {
  constructor(private readonly operationRecService: OperationRecService) {}

  @Post()
  create(@Body() body: Prisma.OperationRecCreateInput) {
    return this.operationRecService.create(body);
  }

  @Get()
  findAll(@Query() query: SearchOperationRecDto) {
    return this.operationRecService.findAll(query);
  }

  @Get('auth')
  findAuthAll(@Query() query: SearchAuthOperationRecDto, @Request() req) {
    // console.log(req.session.user);
    return this.operationRecService.findAuthAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operationRecService.findOne(+id);
  }
}
