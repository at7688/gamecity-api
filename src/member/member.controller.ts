import { RegisterAgentDto } from './dto/register-agent.dto';
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
import { SetAgentDutyDto } from './dto/set-agent-duty.dto';
import { Public } from 'src/metas/public.meta';

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
  create(@Body() body: CreateAgentDto, @User() user: LoginUser) {
    return this.memberService.create(body, user);
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

  @Post(':id/duty')
  setDuty(@Param('id') id: string, @Body() data: SetAgentDutyDto) {
    return this.memberService.setDuty(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }
}
