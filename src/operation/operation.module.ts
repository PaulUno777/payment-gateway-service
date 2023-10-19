import { Module } from '@nestjs/common';
import { OperationService } from './operation.service';
import { OperationController } from './operation.controller';
import { MomoModule } from 'src/momo/momo.module';
import { PhoneHelperModule } from '@app/phone-helper';
import { PaymentProviderModule } from 'src/payment-provider/payment-provider.module';

@Module({
  controllers: [OperationController],
  providers: [OperationService],
  imports: [PhoneHelperModule, MomoModule, PaymentProviderModule],
})
export class OperationModule {}
