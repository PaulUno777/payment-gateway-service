import { Controller, Get, Put, Body } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HasRole } from '@app/common';
import { RoleType } from 'src/auth/types/role-type';

@ApiBearerAuth('jwt-auth')
@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}
  @Get()
  getConfig() {
    return this.configurationService.getConfig();
  }
  @HasRole(RoleType.super_admin)
  @Put()
  setConfig(@Body() newConfig) {
    this.configurationService.setConfig(newConfig);
    return this.configurationService.getConfig();
  }
}
