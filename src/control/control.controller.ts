import { Controller, Get } from '@nestjs/common';
import { ControlService } from './control.service';
import { IsPublic } from '@app/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Controls test purpose only')
@IsPublic()
@Controller('control')
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Get()
  checkTransactionState() {
    return this.controlService.checkTransactionState();
  }
}
