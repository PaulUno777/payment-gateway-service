import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { CreateApiClientReq } from './dto/create-api-client.dto';
import { UpdateApiClientReq } from './dto/update-api-client.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HasRole } from '@app/common';
import { RoleType } from '@prisma/client';

@ApiTags('Api Client')
@Controller('api-client')
export class ApiClientController {
  constructor(private readonly apiClientService: ApiClientService) {}

  @Post()
  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  create(@Body() createApiClientDto: CreateApiClientReq) {
    return this.apiClientService.create(createApiClientDto);
  }

  @Get()
  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  findAll() {
    return this.apiClientService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  findOne(@Param('id') id: string) {
    return this.apiClientService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  update(@Param('id') id: string, @Body() updateRequest: UpdateApiClientReq) {
    return this.apiClientService.update(id, updateRequest);
  }

  @Patch(':id/toggle_activation')
  @ApiBearerAuth('jwt-auth')
  @HasRole(RoleType.super_admin, RoleType.manage_users)
  @HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.client_manager)
  remove(@Param('id') id: string) {
    return this.apiClientService.toggleActivateState(id);
  }
}
