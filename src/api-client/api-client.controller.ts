import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { CreateApiClientReq } from './dto/create-api-client.dto';
import { UpdateApiClientReq } from './dto/update-api-client.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HasRole } from '@app/common';
import { RoleType } from 'src/auth/types/role-type';

@ApiTags('Api Client')
@Controller('api-client')
export class ApiClientController {
  constructor(private readonly apiClientService: ApiClientService) {}

  @HasRole(RoleType.super_admin)
  @Post()
  @ApiBearerAuth('jwt-auth')
  create(@Body() createApiClientDto: CreateApiClientReq) {
    return this.apiClientService.create(createApiClientDto);
  }

  @HasRole(RoleType.super_admin)
  @Get()
  @ApiBearerAuth('jwt-auth')
  findAll() {
    return this.apiClientService.findAll();
  }

  @HasRole(RoleType.super_admin, RoleType.api_client)
  @Get(':id')
  @ApiBearerAuth('jwt-auth')
  findOne(@Param('id') id: string) {
    return this.apiClientService.findOne(id);
  }

  @HasRole(RoleType.super_admin, RoleType.api_client)
  @Patch(':id')
  @ApiBearerAuth('jwt-auth')
  update(@Param('id') id: string, @Body() updateRequest: UpdateApiClientReq) {
    return this.apiClientService.update(id, updateRequest);
  }

  @HasRole(RoleType.super_admin)
  @Patch(':id/toggle-activation')
  @ApiBearerAuth('jwt-auth')
  toggleActivation(@Param('id') id: string) {
    return this.apiClientService.toggleActivation(id);
  }

  @HasRole(RoleType.super_admin)
  @Patch('keyPair/:id/regenerate')
  @ApiBearerAuth('jwt-auth')
  reGenKeyPaire(@Param('id') id: string) {
    return this.apiClientService.reGenKeyPaire(id);
  }
}
