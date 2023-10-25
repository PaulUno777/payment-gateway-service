import { Module } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { ApiClientController } from './api-client.controller';

@Module({
  controllers: [ApiClientController],
  providers: [ApiClientService],
  exports: [ApiClientService],
})
export class ApiClientModule {}
