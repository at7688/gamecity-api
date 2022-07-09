import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Serilizer } from 'src/interceptors/serializer.interceptor';
import { MemberDto } from './dto/member.dto';
import { SearchMembersDto } from './dto/search-members.dto';

@Controller('members')
@Serilizer(MemberDto)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  findAll(@Query() query?: SearchMembersDto) {
    return this.memberService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }
}
