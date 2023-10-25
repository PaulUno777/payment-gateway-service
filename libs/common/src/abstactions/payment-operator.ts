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
  Empty,
  FinanceRequest,
  FinanceResponse,
  ProviderInfoResponse,
  StatusRequest,
  StatusResponse,
  UserInfosRequest,
  UserInfosResponse,
} from 'src/momo/momo';
import { Observable } from 'rxjs';
import { Amount, AccountBalanceResponse } from 'src/intouch/intouch';

export abstract class PaymentOperator {
  logger?: Logger;

  codes?: ProviderCode[] | string[];

  getProviderInfo(): Promise<string[]> | Observable<string[]> {
    throw new Error('Method not implemented.');
  }

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
