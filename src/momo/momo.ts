/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "momo_package";

export interface Empty {
}

export interface ProviderInfoResponse {
  providers: ProviderInfo[];
}

export interface ProviderInfo {
  operatorName: string;
  operatorType: string;
  operatorCode: string;
  applyCountry: string[];
  params: ProviderParams | undefined;
}

export interface ProviderParams {
  isDepositAvailable: boolean;
  isWithdrawalAvailable: boolean;
  isBalanceInfoAvailable: boolean;
  isCustomerInfoAvailable: boolean;
}

export interface UserInfosRequest {
  phoneNumber: string;
  providerCode: string;
}

export interface UserInfosResponse {
  success: boolean;
  trace: string;
  providerResponse: ProviderResponse | undefined;
  data: UserData | undefined;
}

export interface UserData {
  firstName: string;
  lastName: string;
}

export interface StatusRequest {
  id: string;
  payToken: string;
  mouvement: string;
  providerCode: string;
}

export interface StatusResponse {
  success: boolean;
  trace: string;
  providerResponse: ProviderResponse | undefined;
  data: StatusData | undefined;
}

export interface StatusData {
  status: string;
  payToken: string;
  payer: Payer | undefined;
  payee: Payer | undefined;
  owner: Payer | undefined;
  currency: string;
  financialTransactionId: string;
  externalId: string;
  errorMessage: string;
  amount: number;
  fees: number;
}

export interface FinanceRequest {
  id: string;
  amount: number;
  payerPhone: string;
  description: string;
  providerCode: string;
  payToken: string;
}

export interface FinanceResponse {
  success: boolean;
  trace: string;
  providerResponse: ProviderResponse | undefined;
  data: FinanceData | undefined;
}

export interface FinanceData {
  payToken: string;
  payer: Payer | undefined;
  payee: Payer | undefined;
}

export interface ProviderResponse {
  code: number;
  status: string;
  message: string;
  date: string;
}

export interface Payer {
  partyIdType: string;
  partyId: string;
}

export const MOMO_PACKAGE_PACKAGE_NAME = "momo_package";

export interface PaymentServiceClient {
  cashIn(request: FinanceRequest): Observable<FinanceResponse>;

  cashOut(request: FinanceRequest): Observable<FinanceResponse>;

  checkTransactionStatus(request: StatusRequest): Observable<StatusResponse>;

  checkUserInfos(request: UserInfosRequest): Observable<UserInfosResponse>;
}

export interface PaymentServiceController {
  cashIn(request: FinanceRequest): Promise<FinanceResponse> | Observable<FinanceResponse> | FinanceResponse;

  cashOut(request: FinanceRequest): Promise<FinanceResponse> | Observable<FinanceResponse> | FinanceResponse;

  checkTransactionStatus(request: StatusRequest): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;

  checkUserInfos(
    request: UserInfosRequest,
  ): Promise<UserInfosResponse> | Observable<UserInfosResponse> | UserInfosResponse;
}

export function PaymentServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["cashIn", "cashOut", "checkTransactionStatus", "checkUserInfos"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PaymentService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PaymentService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PAYMENT_SERVICE_NAME = "PaymentService";

export interface ProviderServiceClient {
  getProviderInfo(request: Empty): Observable<ProviderInfoResponse>;
}

export interface ProviderServiceController {
  getProviderInfo(
    request: Empty,
  ): Promise<ProviderInfoResponse> | Observable<ProviderInfoResponse> | ProviderInfoResponse;
}

export function ProviderServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getProviderInfo"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProviderService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProviderService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PROVIDER_SERVICE_NAME = "ProviderService";
