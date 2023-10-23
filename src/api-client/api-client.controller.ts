import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { CreateApiClientReq } from './dto/create-api-client.dto';
import { UpdateApiClientReq } from './dto/update-api-client.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HasRole } from '@app/common';
import { RoleType } from '@app/common/prisma/client-auth';

@HasRole(RoleType.super_admin, RoleType.manage_users, RoleType.all)
@ApiTags('Api Client')
@Controller('api-client')
export class ApiClientController {
  constructor(private readonly apiClientService: ApiClientService) {}

  @Post()
  @ApiBearerAuth('jwt-auth')
  create(@Body() createApiClientDto: CreateApiClientReq) {
    return this.apiClientService.create(createApiClientDto);
  }

  @Get()
  @ApiBearerAuth('jwt-auth')
  findAll() {
    return this.apiClientService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('jwt-auth')
  findOne(@Param('id') id: string) {
    return this.apiClientService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('jwt-auth')
  update(@Param('id') id: string, @Body() updateRequest: UpdateApiClientReq) {
    return this.apiClientService.update(id, updateRequest);
  }

  @Patch(':id/toggle-activation')
  @ApiBearerAuth('jwt-auth')
  toggleActivation(@Param('id') id: string) {
    return this.apiClientService.toggleActivation(id);
  }
}
