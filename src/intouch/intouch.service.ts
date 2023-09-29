import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  PAYMENT_SERVICE_NAME,
  PaymentClient,
  amount,
  cashInReq,
  cashInRes,
  transactionId,
  transactionStatus,
  voidNoParam,
} from './intouch';
import { Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { INTOUCH_PACKAGE_NAME } from '@app/common/constants';

@Injectable()
export class IntouchService implements PaymentClient, OnModuleInit {
  private paymentService: PaymentClient;

  constructor(@Inject(INTOUCH_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.paymentService =
      this.client.getService<PaymentClient>(PAYMENT_SERVICE_NAME);
  }

  getAccountBalance(request: voidNoParam): Observable<amount> {
    return this.paymentService.getAccountBalance(request);
  }
  checkTransactionStatus(
    request: transactionId,
  ): Observable<transactionStatus> {
    return this.paymentService.checkTransactionStatus(request);
  }
  cashIn(request: cashInReq): Observable<cashInRes> {
    return this.paymentService.cashIn(request);
  }
}
