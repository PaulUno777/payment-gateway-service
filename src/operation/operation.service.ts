import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OperationRequest, ProcessRequest } from './dto/operation-request';
import { PhoneHelperService } from '@app/phone-helper';
import { PaymentProviderService } from 'src/payment-provider/payment-provider.service';
import {
  Observable,
  catchError,
  forkJoin,
  from,
  map,
  of,
  switchMap,
} from 'rxjs';
import { UserInfo } from './dto/operation-response.dto';
import {
  Mouvement,
  PaymentProvider,
  State,
  Transaction,
  ProviderCode,
} from '@prisma/client';
import { OperatorGatewayLoader } from './operator-gateway.loader';
import { UserInfosProvider } from '@app/common/interfaces';
import { TransactionService } from 'src/transaction/transaction.service';
import { CreateTransactionRequest } from 'src/transaction/dto/transaction-request.dto';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { FinanceRequest, FinanceResponse } from 'src/momo/momo';
import { randomUUID } from 'crypto';
import { ExecutionReportService } from 'src/transaction/execution-report.service';

@Injectable()
export class OperationService {
  private readonly logger = new Logger(OperationService.name);
  private isAutomatic: boolean;
  constructor(
    private phoneHelper: PhoneHelperService,
    private transactionService: TransactionService,
    private readonly operatorGatewayLoader: OperatorGatewayLoader,
    private readonly paymentProviderService: PaymentProviderService,
    private readonly configuration: ConfigurationService,
    private readonly executionReportService: ExecutionReportService,
  ) {}

  getSubscriberInfos(
    countryAlpha2: string,
    partyIdType: string,
    partyId: string,
  ): Observable<UserInfo> {
    this.logger.log("= = => Retrieving the subscriber's information <= = =");

    const helper = this.phoneHelper.load(
      countryAlpha2.toUpperCase(),
      partyIdType,
    );

    const formatedNumber = helper.formatPhoneNumber(
      partyId,
      countryAlpha2.toUpperCase(),
    );

    const operatorCode = helper.getProviderCodeByMsisdn(formatedNumber);

    return from(this.paymentProviderService.findOneByCode(operatorCode)).pipe(
      switchMap((provider) => {
        if (!provider.params.isCustomerInfoAvailable) {
          throw new ServiceUnavailableException(
            'This service is currently unavailable on this provider',
          );
        }
        const request = {
          phoneNumber: formatedNumber,
          providerCode: operatorCode,
        };

        const providerService = this.operatorGatewayLoader.load(provider.code);

        const userInfosProvider: UserInfosProvider = providerService;

        return from(userInfosProvider.checkUserInfos(request)).pipe(
          map((response) => {
            const firstName = response.data.firstName;
            const lastName = response.data.lastName;
            const fullName = firstName + ' ' + lastName;
            return {
              firstName,
              lastName,
              fullName,
              provider: operatorCode,
              msisdn: formatedNumber,
            };
          }),
        );
      }),
      catchError((error) => {
        console.log('error', error);
        throw error;
      }),
    );
  }

  cashin(currentSource, operationRequest: OperationRequest): Observable<any> {
    this.checkConfiguration();
    const source = {
      name: currentSource.email,
      type: currentSource.type,
      entityId: currentSource.sub,
    };
    const mouvement = Mouvement.DEPOSIT;

    return this.getSubscriberInfos(
      operationRequest.recipientDetails.country,
      operationRequest.recipientDetails.payeeId.partyIdType,
      operationRequest.recipientDetails.payeeId.partyId,
    ).pipe(
      switchMap((userInfo) => {
        const request: CreateTransactionRequest = {
          ...operationRequest,
          source,
          operatorCode: userInfo.provider,
          mouvement,
        };
        const recipient = operationRequest.recipientDetails;
        request.recipientDetails = {
          ...recipient,
          name: userInfo.fullName,
          payeeId: { ...recipient.payeeId, partyId: userInfo.msisdn },
        };
        return from(this.transactionService.create(request)).pipe(
          switchMap((transaction) => {
            if (operationRequest.providerCode || this.isAutomatic) {
              return this.initiateTransaction(transaction);
            }
            return of({ message: 'Transaction initiated successfully.' });
          }),
        );
      }),
    );
  }

  cashout(currentSource, operationRequest: OperationRequest) {
    this.checkConfiguration();
    const source = {
      name: currentSource.email,
      type: currentSource.type,
      entityId: currentSource.sub,
    };
    const mouvement = Mouvement.WITHDRAWAL;

    return this.getSubscriberInfos(
      operationRequest.recipientDetails.country,
      operationRequest.recipientDetails.payeeId.partyIdType,
      operationRequest.recipientDetails.payeeId.partyId,
    ).pipe(
      switchMap((userInfo) => {
        const request: CreateTransactionRequest = {
          ...operationRequest,
          source,
          operatorCode: userInfo.provider,
          mouvement,
        };
        const recipient = operationRequest.recipientDetails;
        request.recipientDetails = {
          ...recipient,
          name: userInfo.fullName,
          payeeId: { ...recipient.payeeId, partyId: userInfo.msisdn },
        };
        return from(this.transactionService.create(request)).pipe(
          switchMap((transaction) => {
            if (operationRequest.providerCode || this.isAutomatic) {
              return this.initiateTransaction(transaction);
            }
            return of({ message: 'Transaction initiated successfully.' });
          }),
        );
      }),
    );
  }

  getStatus(id: string) {
    throw new Error('Method not implemented.');
  }

  processTransaction(request: ProcessRequest) {
    return this.transactionService.findOneToRetry(request.id).pipe(
      switchMap((transaction) => {
        return this.transactionService
          .update(transaction.id, { providerCode: request.providerCode })
          .pipe(
            switchMap((transaction) => {
              return this.initiateTransaction(transaction);
            }),
          );
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }

  initiateTransaction(transaction: Transaction): Observable<any> {
    const isDeposit = transaction.mouvement == Mouvement.DEPOSIT;
    return from(this.loadProvider(transaction)).pipe(
      switchMap((provider) => {
        return this.makeTransaction(transaction, provider.code, isDeposit);
      }),
    );
  }

  makeTransaction(transaction: Transaction, providerCode, isDeposit) {
    return this.transactionService
      .update(transaction.id, {
        providerCode: providerCode,
      })
      .pipe(
        switchMap((transaction) => {
          const provider = this.operatorGatewayLoader.load(
            transaction.providerCode,
          );
          const financeRequest: FinanceRequest = {
            id: transaction.id,
            amount: transaction.amount.destinationAmount,
            payerPhone: transaction.recipientDetails.payeeId.partyId,
            description: transaction.description,
            providerCode: transaction.providerCode,
            payToken: randomUUID(),
          };
          let operationObservable;
          if (isDeposit) {
            operationObservable = provider.cashIn(financeRequest);
          } else {
            operationObservable = provider.cashOut(financeRequest);
          }

          return from(operationObservable).pipe(
            switchMap((financeResponse: FinanceResponse) => {
              if (financeResponse.success) {
                const update = {
                  payToken: financeResponse.data.payToken,
                  state: State.PENDING,
                };
                return forkJoin({
                  transactionUpdate: from(
                    this.transactionService.update(financeRequest.id, update),
                  ),
                  anotherResult: from(
                    this.executionReportService.create({
                      startLog: financeResponse.providerResponse,
                      startTrace: financeResponse.trace,
                      transactionId: transaction.id,
                    }),
                  ),
                }).pipe(
                  map(() => {
                    return { message: 'Transaction is being processed' };
                  }),
                );
              }
              const update = {
                payToken: financeResponse.data.payToken,
                state: State.FAILED,
              };
              return forkJoin({
                transactionUpdate: from(
                  this.transactionService.update(financeRequest.id, update),
                ),
                executionReportUpdate: from(
                  this.executionReportService.create({
                    startLog: financeResponse.providerResponse,
                    startTrace: financeResponse.trace,
                    transactionId: transaction.id,
                  }),
                ),
              }).pipe(
                map(() => {
                  return {
                    message:
                      'Error occurred while processing the transaction. Please try again.',
                  };
                }),
              );
            }),
          );
        }),
        catchError((error) => {
          throw error;
        }),
      );
  }

  loadProvider(transaction: Transaction): Observable<PaymentProvider> {
    if (transaction.providerCode)
      return this.paymentProviderService
        .findByCode(transaction.providerCode)
        .pipe(
          map((provider: PaymentProvider[]) => {
            const filtered = provider.filter((elt) => {
              let isAvaillable = false;
              if (transaction.mouvement == Mouvement.DEPOSIT)
                isAvaillable = elt.params.isDepositAvailable;
              if (transaction.mouvement == Mouvement.WITHDRAWAL)
                isAvaillable = elt.params.isWithdrawalAvailable;
              return elt.code === transaction.operatorCode && isAvaillable;
            });
            if (filtered.length == 0)
              throw new ServiceUnavailableException(
                'Service is currently unavailable on provider',
              );
            return filtered[0];
          }),
        );
    return from(
      this.paymentProviderService.findSuitableProvider(
        transaction.amount.destinationAmount,
        transaction.recipientDetails.payeeId.partyIdType,
      ),
    ).pipe(
      map((provider: PaymentProvider[]) => {
        const filtered = provider.filter((elt) => {
          let isAvaillable = false;
          if (transaction.mouvement == Mouvement.DEPOSIT)
            isAvaillable = elt.params.isDepositAvailable;
          if (transaction.mouvement == Mouvement.WITHDRAWAL)
            isAvaillable = elt.params.isWithdrawalAvailable;
          return elt.code === transaction.operatorCode && isAvaillable;
        });
        if (filtered.length == 0)
          throw new ServiceUnavailableException(
            'Service is currently unavailable on provider',
          );
        return filtered[0];
      }),
    );
  }

  checkConfiguration() {
    this.isAutomatic =
      this.configuration.getConfig().makeTransactionAuto || false;
  }
}
