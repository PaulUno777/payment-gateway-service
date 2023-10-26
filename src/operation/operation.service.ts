import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { Mouvement, PaymentProvider, State, Transaction } from '@prisma/client';
import { OperatorGatewayLoader } from './operator-gateway.loader';
import {
  CheckTransactionStatus,
  UserInfosProvider,
} from '@app/common/interfaces';
import { TransactionService } from 'src/transaction/transaction.service';
import { CreateTransactionRequest } from 'src/transaction/dto/transaction-request.dto';
import { ConfigurationService } from 'src/configuration/configuration.service';
import {
  FinanceRequest,
  FinanceResponse,
  StatusRequest,
  StatusResponse,
} from 'src/momo/momo';
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
    this.logger.log("= = => [ Retrieve subscriber's informations ] <= = =");

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
    this.logger.log('= = => [ Make a Cashin ] <= = =');
    return this.createTransaction(
      currentSource,
      operationRequest,
      Mouvement.DEPOSIT,
    );
  }

  cashout(currentSource, operationRequest: OperationRequest) {
    this.logger.log('= = => [ Make a Cashout ] <= = =');

    return this.createTransaction(
      currentSource,
      operationRequest,
      Mouvement.WITHDRAWAL,
    );
  }

  checkPaymentStatus(id: string) {
    this.logger.log('= = => [ Check a transaction status ] <= = =');
    return this.transactionService.findOne(id).pipe(
      switchMap((transaction) => {
        return this.getStatus(transaction).pipe();
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }

  createTransaction(
    currentSource,
    operationRequest: OperationRequest,
    mouvement: Mouvement,
  ): Observable<{ message: string }> {
    this.checkConfiguration();

    const source = {
      name: currentSource.email,
      type: currentSource.type,
      entityId: currentSource.sub,
    };

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
            if (operationRequest.providerCode && this.isAutomatic) {
              return this.initiateTransaction(transaction);
            }
            return of({
              message: 'Transaction initiated successfully.',
              transactionId: transaction.id,
              state: transaction.state,
            });
          }),
        );
      }),
    );
  }

  processTransaction(request: ProcessRequest) {
    this.logger.log(
      '= = => [ Process a created or failed transaction ] <= = =',
    );

    return this.transactionService.findOneToRetry(request.id).pipe(
      switchMap((transaction) => {
        if (
          request.providerCode !== transaction.operatorCode &&
          !request.providerCode.includes('AUTO_USSD')
        )
          throw new BadRequestException(
            'Invalid Provider code, this Operator is incompatible with party ID',
          );

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
                      providerCode: transaction.providerCode,
                      payToken: financeResponse.data.payToken,
                      startLog: financeResponse.providerResponse,
                      startTrace: financeResponse.trace,
                      transactionId: transaction.id,
                    }),
                  ),
                }).pipe(
                  map((response) => {
                    return {
                      message: 'Transaction is being processed',
                      transactionId: transaction.id,
                      state: response.transactionUpdate.state,
                    };
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
                    providerCode: transaction.providerCode,
                    payToken: financeResponse.data.payToken,
                    startLog: financeResponse.providerResponse,
                    startTrace: financeResponse.trace,
                    transactionId: transaction.id,
                  }),
                ),
              }).pipe(
                map((response) => {
                  return {
                    message:
                      'Error occurred while processing the transaction. Please try again.',
                    transactionId: transaction.id,
                    state: response.transactionUpdate.state,
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

  getStatus(
    transaction: Transaction,
  ): Observable<{ success: boolean; transaction: Transaction }> {
    if (transaction.state !== State.PENDING) {
      return of({ success: true, transaction });
    }

    const provider: CheckTransactionStatus = this.operatorGatewayLoader.load(
      transaction.providerCode,
    );
    const statusRequest: StatusRequest = {
      id: transaction.id,
      mouvement: transaction.mouvement,
      providerCode: transaction.providerCode,
      payToken: transaction.payToken,
    };

    return from(provider.checkTransactionStatus(statusRequest)).pipe(
      switchMap((status: StatusResponse) => {
        let state: State = State.PENDING;
        console.log('status', status);
        if (status.success) {
          if (
            status.data.status === 'SUCCESSFUL' ||
            status.data.status === 'SUCCESSFULL'
          )
            state = State.SUCCESS;
          if (
            status.data.status === 'FAILED' ||
            status.data.status === 'EXPIRED'
          )
            state = State.FAILED;

          if (state !== State.PENDING)
            return forkJoin({
              transactionUpdate: from(
                this.transactionService.update(transaction.id, {
                  fees: status.data.fees || 0,
                  state,
                }),
              ),
              executionReport: from(
                this.executionReportService.update(transaction.id, {
                  endLog: status.providerResponse,
                  endTrace: status.trace,
                }),
              ),
            }).pipe(
              map((response) => {
                return {
                  success: true,
                  transaction: response.transactionUpdate,
                };
              }),
            );
          return of({
            success: true,
            transaction: transaction,
          });
        }
        return of({ success: false, transaction });
      }),
      catchError((error) => {
        throw new InternalServerErrorException(
          'An unexpected error occurred.' + error,
        );
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
