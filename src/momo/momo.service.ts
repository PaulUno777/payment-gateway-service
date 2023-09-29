import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  FinanceRequest,
  FinanceResponse,
  PAYMENT_SERVICE_NAME,
  PaymentServiceClient,
  StatusRequest,
  StatusResponse,
  UserInfosRequest,
  UserInfosResponse,
} from './momo';
import { Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { MOMO_PACKAGE_NAME } from '@app/common/constants';

@Injectable()
export class MomoService implements PaymentServiceClient, OnModuleInit {
  private paymentService: PaymentServiceClient;

  constructor(@Inject(MOMO_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.paymentService =
      this.client.getService<PaymentServiceClient>(PAYMENT_SERVICE_NAME);
  }

  cashIn(request: FinanceRequest): Observable<FinanceResponse> {
    return this.paymentService.cashIn(request);
  }

  cashOut(request: FinanceRequest): Observable<FinanceResponse> {
    return this.paymentService.cashOut(request);
  }

  checkTransactionStatus(request: StatusRequest): Observable<StatusResponse> {
    return this.paymentService.checkTransactionStatus(request);
  }

  checkUserInfos(request: UserInfosRequest): Observable<UserInfosResponse> {
    return this.paymentService.checkUserInfos(request);
  }
}
