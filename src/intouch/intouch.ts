/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "intouchPackage";

export interface VoidNoParam {
}

export interface Amount {
  amount: number;
}

export interface StatusRequest {
  id: string;
}

export interface StatusResponse {
  success: boolean;
  message: string;
  providerResponse: ProviderResponse | undefined;
}

export interface FinanceRequest {
  payerPhone?: string;
  amount?: number;
  id?: string;
  callbackUrl?: string;
}

export interface FinanceResponse {
  success: boolean;
  message: string;
  providerResponse: ProviderResponse | undefined;
}

export interface ProviderResponse {
  code: number;
  status: string;
  financialTransactionId: string;
  amount: string;
  externalId: string;
  message: string;
  payToken: string;
}

export const INTOUCH_PACKAGE_PACKAGE_NAME = "intouchPackage";

export interface PaymentClient {
  getAccountBalance(request: VoidNoParam): Observable<Amount>;

  checkTransactionStatus(request: StatusRequest): Observable<StatusResponse>;

  cashIn(request: FinanceRequest): Observable<FinanceResponse>;
}

export interface PaymentController {
  getAccountBalance(request: VoidNoParam): Promise<Amount> | Observable<Amount> | Amount;

  checkTransactionStatus(request: StatusRequest): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;

  cashIn(request: FinanceRequest): Promise<FinanceResponse> | Observable<FinanceResponse> | FinanceResponse;
}

export function PaymentControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getAccountBalance", "checkTransactionStatus", "cashIn"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Payment", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Payment", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PAYMENT_SERVICE_NAME = "Payment";
