/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import { ProviderCode } from '@prisma/client';
import {
  CashInProvider,
  CashOutProvider,
  CheckTransactionStatus,
  UserInfosProvider,
} from '../interfaces';
import {
  FinanceRequest,
  FinanceResponse,
  StatusRequest,
  StatusResponse,
  UserInfosRequest,
  UserInfosResponse,
} from 'src/momo/momo';
import { Observable } from 'rxjs';
import { Empty, Amount, AccountBalanceResponse } from 'src/intouch/intouch';

export abstract class PaymentOperator {
  logger?: Logger;

  code?: ProviderCode[] | string[];

  getAccountBalance(
    request: Empty,
  ): Observable<AccountBalanceResponse> | Observable<Amount> {
    throw new Error('Method not implemented.');
  }

  checkUserInfos(
    request: UserInfosRequest,
  ): Promise<UserInfosResponse> | Observable<UserInfosResponse> {
    throw new Error('Method not implemented.');
  }

  checkTransactionStatus(
    StatusRequest: StatusRequest,
  ): Promise<StatusResponse> | Observable<StatusResponse> {
    throw new Error('Method not implemented.');
  }

  cashOut(
    financeRequest: FinanceRequest,
  ): Promise<FinanceResponse> | Observable<FinanceResponse> {
    throw new Error('Method not implemented.');
  }

  cashIn(
    financeRequest: FinanceRequest,
  ): Promise<FinanceResponse> | Observable<FinanceResponse> {
    throw new Error('Method not implemented.');
  }
}
