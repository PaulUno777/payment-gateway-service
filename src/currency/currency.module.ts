import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { CurrencyapiService } from './currency-api.service';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService, CurrencyapiService],
})
export class CurrencyModule {}
