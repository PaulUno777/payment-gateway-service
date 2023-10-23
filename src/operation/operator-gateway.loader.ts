import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MomoService } from 'src/momo/momo.service';
import { ProviderCode } from '@prisma/client';
import { IntouchService } from 'src/intouch/intouch.service';
import { PaymentOperator } from '@app/common/abstactions';

@Injectable()
export class OperatorGatewayLoader {
  private readonly logger = new Logger(OperatorGatewayLoader.name);
  private readonly paymentOperators: Set<PaymentOperator>;
  constructor(
    private readonly intouchService: IntouchService,
    private readonly momoService: MomoService,
  ) {
    this.paymentOperators = new Set([this.intouchService, this.momoService]);
  }

  load(providerCode: ProviderCode) {
    this.logger.log('= = => Loading payment operator <= = =');
    console.log('providerCode', providerCode);
    for (const provider of this.paymentOperators) {
      if (provider.code.includes(providerCode)) {
        return provider;
      }
    }
    throw new ServiceUnavailableException(
      'This service is currently unavailable on this provider',
    );
  }
}
