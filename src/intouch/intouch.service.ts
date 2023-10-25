import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  FinanceRequest,
  FinanceResponse,
  PAYMENT_SERVICE_NAME,
  PaymentServiceClient,
  StatusRequest,
  StatusResponse,
  Empty,
  AccountBalanceResponse,
} from './intouch';
import { Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { INTOUCH_PACKAGE_NAME } from '@app/common/constants';
import { PaymentOperator } from '@app/common/abstactions';
import { ProviderCode } from '@prisma/client';

@Injectable()
export class IntouchService
  extends PaymentOperator
  implements OnModuleInit, PaymentServiceClient
{
  private paymentService: PaymentServiceClient;

  constructor(@Inject(INTOUCH_PACKAGE_NAME) private client: ClientGrpc) {
    super();
    this.codes = [ProviderCode.CM_INTOUCH];
  }

  onModuleInit() {
    this.paymentService =
      this.client.getService<PaymentServiceClient>(PAYMENT_SERVICE_NAME);
  }

  getAccountBalance(request: Empty): Observable<AccountBalanceResponse> {
    return this.paymentService.getAccountBalance(request);
  }

  checkTransactionStatus(request: StatusRequest): Observable<StatusResponse> {
    return this.paymentService.checkTransactionStatus(request);
  }

  cashIn(request: FinanceRequest): Observable<FinanceResponse> {
    return this.paymentService.cashIn(request);
  }
}
