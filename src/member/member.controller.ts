import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RegisterAgentDto } from './dto/register-agent.dto';

import { User } from 'src/decorators/user.decorator';
import { Serilizer } from 'src/interceptors/serializer.interceptor';
import { Public } from 'src/metas/public.meta';
import { LoginUser } from 'src/types';
import { CreateAgentDto } from './dto/create-agent.dto';
import { MemberDto } from './dto/member.dto';
import { SearchAgentsDto } from './dto/search-agents.dto';
import { SetAgentDutyDto } from './dto/set-agent-duty.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberService } from './member.service';

@Controller('agent')
@Serilizer(MemberDto)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('register')
  @Public()
  register(@Body() body: RegisterAgentDto) {
    return this.memberService.register(body);
  }

  @Post('create')
  create(@Body() body: CreateAgentDto) {
    return this.memberService.create(body);
  }

  @Post('list')
  findAll(@Body() search: SearchAgentsDto, @User() user: LoginUser) {
    return this.memberService.findAll(search, user);
  }

  @Get('tree')
  getTreeNode(@Query('parent_id') parent_id: string, @User() user: LoginUser) {
    return this.memberService.getTreeNode(parent_id, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(id, updateMemberDto);
  }

  @Post('duty')
  setDuty(@Body() data: SetAgentDutyDto) {
    return this.memberService.setDuty(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }
}
