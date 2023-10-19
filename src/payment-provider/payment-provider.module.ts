import { Module } from '@nestjs/common';
import { PaymentProviderService } from './payment-provider.service';
import { PaymentProviderController } from './payment-provider.controller';

@Module({
  controllers: [PaymentProviderController],
  providers: [PaymentProviderService],
  exports: [PaymentProviderService],
})
export class PaymentProviderModule {}
