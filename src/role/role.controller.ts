import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() { name, code, permission_ids }: CreateRoleDto) {
    return this.roleService.create({
      name,
      code,
      menu: {
        connect: permission_ids.map((per_id) => ({ id: per_id })),
      },
    });
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() { name, code, permission_ids }: UpdateRoleDto,
  ) {
    return this.roleService.update(id, {
      name,
      code,
      menu: {
        set: permission_ids.map((per_id) => ({ id: per_id })),
      },
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
