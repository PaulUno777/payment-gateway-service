/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'momo_package';

export interface UserInfosRequest {
  phoneNumber: string;
  providerCode: string;
}

export interface UserInfosResponse {
  firstname: string;
  lastname: string;
  gender: string;
  birthdate: string;
  locale: string;
}

export interface StatusRequest {
  id: string;
  payToken: string;
  Mouvement: string;
  providerCode: string;
}

export interface StatusResponse {
  success: boolean;
  message: string;
  providerResponse: ProviderResponse | undefined;
}

export interface FinanceRequest {
  id: string;
  amount: number;
  payerPhone: string;
  description: string;
  callbackUrl: string;
  externalId: string;
  payToken: string;
  providerCode: string;
  apiClient: string;
}

export interface FinanceResponse {
  success: boolean;
  message: string;
  providerResponse: ProviderResponse | undefined;
}

export interface ProviderResponse {
  code?: number;
  status?: string;
  financialTransactionId?: string;
  amount?: string;
  externalId?: string;
  message?: string;
  customer?: Payer | undefined;
  owner?: Payer | undefined;
  payToken?: string;
}

export interface Payer {
  partyIdType: string;
  partyId: string;
}

export const MOMO_PACKAGE_PACKAGE_NAME = 'momo_package';

export interface PaymentServiceClient {
  cashIn(request: FinanceRequest): Observable<FinanceResponse>;

  cashOut(request: FinanceRequest): Observable<FinanceResponse>;

  checkTransactionStatus(request: StatusRequest): Observable<StatusResponse>;

  checkUserInfos(request: UserInfosRequest): Observable<UserInfosResponse>;
}

export interface PaymentServiceController {
  cashIn(
    request: FinanceRequest,
  ): Promise<FinanceResponse> | Observable<FinanceResponse> | FinanceResponse;

  cashOut(
    request: FinanceRequest,
  ): Promise<FinanceResponse> | Observable<FinanceResponse> | FinanceResponse;

  checkTransactionStatus(
    request: StatusRequest,
  ): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;

  checkUserInfos(
    request: UserInfosRequest,
  ):
    | Promise<UserInfosResponse>
    | Observable<UserInfosResponse>
    | UserInfosResponse;
}

export function PaymentServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'cashIn',
      'cashOut',
      'checkTransactionStatus',
      'checkUserInfos',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('PaymentService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('PaymentService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const PAYMENT_SERVICE_NAME = 'PaymentService';
