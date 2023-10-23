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
import { PaymentOperator } from '@app/common/abstactions';
import { CashInProvider } from '@app/common/interfaces';
import { InfoMomoService } from './info-momo.service';
import { ProviderCode } from '@prisma/client';

@Injectable()
export class MomoService
  extends PaymentOperator
  implements CashInProvider, OnModuleInit
{
  private paymentService: PaymentServiceClient;

  constructor(
    @Inject(MOMO_PACKAGE_NAME) private client: ClientGrpc,
    private infoMomoService: InfoMomoService,
  ) {
    super();
    this.code = [
      ProviderCode.CM_MTN_MOBILE_MONEY,
      ProviderCode.CM_ORANGE_MONEY,
    ];
  }

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
