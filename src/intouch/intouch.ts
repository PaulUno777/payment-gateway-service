/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "intouch_package";

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

export interface AccountBalanceResponse {
  success: boolean;
  trace: string;
  providerResponse: ProviderResponse | undefined;
  data: Amount | undefined;
}

export interface Amount {
  amount: number;
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

export const INTOUCH_PACKAGE_PACKAGE_NAME = "intouch_package";

export interface PaymentServiceClient {
  getAccountBalance(request: Empty): Observable<AccountBalanceResponse>;

  checkTransactionStatus(request: StatusRequest): Observable<StatusResponse>;

  cashIn(request: FinanceRequest): Observable<FinanceResponse>;
}

export interface PaymentServiceController {
  getAccountBalance(
    request: Empty,
  ): Promise<AccountBalanceResponse> | Observable<AccountBalanceResponse> | AccountBalanceResponse;

  checkTransactionStatus(request: StatusRequest): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;

  cashIn(request: FinanceRequest): Promise<FinanceResponse> | Observable<FinanceResponse> | FinanceResponse;
}

export function PaymentServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAccountBalance", "checkTransactionStatus", "cashIn"];
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
