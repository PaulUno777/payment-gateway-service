/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { IsString } from 'class-validator';
import { Observable } from 'rxjs';

export const protobufPackage = 'paymentPackage';

export interface voidNoParam {}

export interface bookId {
  id: number;
}

export interface amount {
  amount: number;
}

export interface transactionId {
  transactionId: string;
}

export interface transactionStatus {
  serviceId: string;
  guTransactionId: string;
  status: string;
  transactionDate: string;
  recipientId: string;
  amount: string;
  recipientInvoiceId: string;
}

export interface cashInReq {
  phoneNumber: string;
  amount: number;
}

export interface cashInRes {
  serviceId: string;
  guTransactionId: string;
  status: string;
  recipientPhoneNumber: string;
  amount: string;
  message: string;
}

export const INTOUCH_PACKAGE_PACKAGE_NAME = 'paymentPackage';

export interface PaymentClient {
  getAccountBalance(request: voidNoParam): Observable<amount>;

  checkTransactionStatus(request: transactionId): Observable<transactionStatus>;

  cashIn(request: cashInReq): Observable<cashInRes>;
}

export interface PaymentController {
  getAccountBalance(
    request: voidNoParam,
  ): Promise<amount> | Observable<amount> | amount;

  checkTransactionStatus(
    request: transactionId,
  ):
    | Promise<transactionStatus>
    | Observable<transactionStatus>
    | transactionStatus;

  cashIn(
    request: cashInReq,
  ): Promise<cashInRes> | Observable<cashInRes> | cashInRes;
}

export function PaymentControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getAccountBalance',
      'checkTransactionStatus',
      'cashIn',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('Payment', method)(
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
      GrpcStreamMethod('Payment', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const PAYMENT_SERVICE_NAME = 'Payment';
