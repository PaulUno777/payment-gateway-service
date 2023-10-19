import { Module } from '@nestjs/common';
import { OperationService } from './operation.service';
import { OperationController } from './operation.controller';
import { MomoModule } from 'src/momo/momo.module';
import { PhoneHelperModule } from '@app/phone-helper';
import { PaymentProviderModule } from 'src/payment-provider/payment-provider.module';
import { OperatorGatewayLoader } from './operator-gateway.loader';
import { IntouchModule } from 'src/intouch/intouch.module';

@Module({
  controllers: [OperationController],
  providers: [OperationService, OperatorGatewayLoader],
  imports: [
    PhoneHelperModule,
    MomoModule,
    PaymentProviderModule,
    IntouchModule,
  ],
})
export class OperationModule {}
