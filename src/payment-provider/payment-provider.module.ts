import { Module } from '@nestjs/common';
import { PaymentProviderService } from './payment-provider.service';
import { PaymentProviderController } from './payment-provider.controller';

@Module({
  controllers: [PaymentProviderController],
  providers: [PaymentProviderService],
})
export class PaymentProviderModule {}
