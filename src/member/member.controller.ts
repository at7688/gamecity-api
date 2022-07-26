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
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Serilizer } from 'src/interceptors/serializer.interceptor';
import { MemberDto } from './dto/member.dto';
import { SearchAgentsDto } from './dto/search-agents.dto';
import { User } from 'src/decorators/user.decorator';
import { LoginUser } from 'src/types';

@Controller('agents')
@Serilizer(MemberDto)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  createAgent(@Body() body: CreateAgentDto) {
    return this.memberService.createAgent(body);
  }

  @Get()
  findAllAgents(@Query() query: SearchAgentsDto, @User() user: LoginUser) {
    return this.memberService.findAllAgents(query, user);
  }
  @Get('parent')
  findAllByParent(
    @Query('parent_id') parent_id: string,
    @User() user: LoginUser,
  ) {
    return this.memberService.findAllByParent(parent_id, user);
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
