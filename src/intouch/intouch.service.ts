import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  Amount,
  FinanceRequest,
  FinanceResponse,
  PAYMENT_SERVICE_NAME,
  PaymentClient,
  StatusRequest,
  StatusResponse,
  VoidNoParam,
} from './intouch';
import { Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { INTOUCH_PACKAGE_NAME } from '@app/common/constants';

@Injectable()
export class IntouchService implements PaymentClient, OnModuleInit {
  private paymentService: PaymentClient;

  constructor(@Inject(INTOUCH_PACKAGE_NAME) private client: ClientGrpc) {}
  getAccountBalance(request: VoidNoParam): Observable<Amount> {
    return this.paymentService.getAccountBalance(request);
  }
  checkTransactionStatus(request: StatusRequest): Observable<StatusResponse> {
    return this.paymentService.checkTransactionStatus(request);
  }
  cashIn(request: FinanceRequest): Observable<FinanceResponse> {
    return this.paymentService.cashIn(request);
  }

  onModuleInit() {
    this.paymentService =
      this.client.getService<PaymentClient>(PAYMENT_SERVICE_NAME);
  }
}
