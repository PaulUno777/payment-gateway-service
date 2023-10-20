import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OperationRequest } from './dto/operation-request';
import { PhoneHelperService } from '@app/phone-helper';
import { PaymentProviderService } from 'src/payment-provider/payment-provider.service';
import { Observable, catchError, from, map, switchMap } from 'rxjs';
import { UserInfo } from './dto/operation-response.dto';
import {
  Mouvement,
  PaymentProvider,
  ProviderCode,
  State,
} from '@prisma/client';
import { OperatorGatewayLoader } from './operator-gateway.loader';
import {
  CashInProvider,
  CashOutProvider,
  UserInfosProvider,
} from '@app/common/interfaces';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class OperationService {
  private readonly logger = new Logger(OperationService.name);
  constructor(
    private phoneHelper: PhoneHelperService,
    private transactionService: TransactionService,
    private readonly operatorGatewayLoader: OperatorGatewayLoader,
    private readonly paymentProviderService: PaymentProviderService,
  ) {}

  getSubscriberInfos(alphacode: string, msisdn: string): Observable<UserInfo> {
    this.logger.log("Retrieving the subscriber's information");

    const country = alphacode.toUpperCase();

    const helper = this.phoneHelper.load(country);

    const formatedNumber = helper.formatPhoneNumber(msisdn, country);

    const operatorCode = helper.getProviderCodeByMsisdn(formatedNumber);

    return from(
      this.paymentProviderService.findByCode(ProviderCode.MOBILE_MONEY_API),
    ).pipe(
      switchMap((provider) => {
        console.log(provider);
        if (!provider.params.isCustomerInfoAvailable || !provider.isActive) {
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
            const firstName = response.providerResponse.userData.firstname;
            const lastName = response.providerResponse.userData.lastname;
            const fullName = firstName + ' ' + lastName;
            return {
              firstName,
              lastName,
              fullName,
              operator: operatorCode,
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

  cashin(currentSource, operationRequest: OperationRequest) {
    const source = {
      name: currentSource.email,
      type: currentSource.type,
      entityId: currentSource.sub,
    };
    const mouvement = Mouvement.WITHDRAWAL;
    return from(this.loadProvider(operationRequest)).pipe(
      switchMap((provider) => {
        if (!provider.params.isWithdrawalAvailable) {
          throw new ServiceUnavailableException(
            `Collection is currently unavailable on provider ${provider.code}`,
          );
        }
        return from(
          this.getSubscriberInfos(
            operationRequest.recipientDetails.country,
            operationRequest.recipientDetails.id,
          ).pipe(
            switchMap((userInfo) => {
              const request = {
                ...operationRequest,
                source,
                mouvement,
                operatorCode: userInfo.operator,
                providerCode: provider.code,
              };
              request.recipientDetails.name = userInfo.fullName;
              request.recipientDetails.id = userInfo.msisdn;
              return from(this.transactionService.create(request)).pipe(
                switchMap((transaction) => {
                  const provider: CashInProvider =
                    this.operatorGatewayLoader.load(transaction.providerCode);
                  const financeRequest = {
                    id: transaction.id,
                    amount: transaction.amount.destinationAmount,
                    payerPhone: transaction.recipientDetails.id,
                    description: transaction.description,
                    externalId: transaction.id,
                    providerCode: transaction.operatorCode,
                    apiClient: transaction.senderDetails.id,
                  };
                  return from(provider.cashIn(financeRequest)).pipe(
                    switchMap((financeResponse) => {
                      if (financeResponse.success) {
                        const update = {
                          fees: financeResponse.providerResponse.fees ?? 0,
                          payToken: financeResponse.providerResponse.payToken,
                          report: {
                            startLog: financeResponse.providerResponse,
                            startTrace: 'not implemented yet',
                          },
                        };
                        return from(
                          this.transactionService.update(
                            financeRequest.id,
                            update,
                          ),
                        );
                      }
                      const update = {
                        fees: financeResponse.providerResponse.fees ?? 0,
                        payToken: financeResponse.providerResponse.payToken,
                        state: State.FAILED,
                        report: {
                          startLog: financeResponse.providerResponse,
                          startTrace: 'not implemented yet',
                        },
                      };
                      return from(
                        this.transactionService.update(
                          financeRequest.id,
                          update,
                        ),
                      );
                    }),
                  );
                }),
              );
            }),
          ),
        );
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }

  cashout(currentSource, operationRequest: OperationRequest) {
    const source = {
      name: currentSource.email,
      type: currentSource.type,
      entityId: currentSource.sub,
    };
    const mouvement = Mouvement.DEPOSIT;
    return from(this.loadProvider(operationRequest)).pipe(
      switchMap((provider) => {
        if (!provider.params.isDepositAvailable) {
          throw new ServiceUnavailableException(
            `Collection is currently unavailable on provider ${provider.code}`,
          );
        }
        return from(
          this.getSubscriberInfos(
            operationRequest.recipientDetails.country,
            operationRequest.recipientDetails.id,
          ).pipe(
            switchMap((userInfo) => {
              const request = {
                ...operationRequest,
                source,
                mouvement,
                operatorCode: userInfo.operator,
                providerCode: provider.code,
              };
              request.recipientDetails.name = userInfo.fullName;
              request.recipientDetails.id = userInfo.msisdn;
              return from(this.transactionService.create(request)).pipe(
                switchMap((transaction) => {
                  const provider: CashOutProvider =
                    this.operatorGatewayLoader.load(transaction.providerCode);
                  const financeRequest = {
                    id: transaction.id,
                    amount: transaction.amount.destinationAmount,
                    payerPhone: transaction.recipientDetails.id,
                    description: transaction.description,
                    externalId: transaction.id,
                    providerCode: transaction.operatorCode,
                    apiClient: transaction.senderDetails.id,
                  };
                  return from(provider.cashOut(financeRequest)).pipe(
                    switchMap((financeResponse) => {
                      if (financeResponse.success) {
                        const update = {
                          fees: financeResponse.providerResponse.fees ?? 0,
                          payToken: financeResponse.providerResponse.payToken,
                          report: {
                            startLog: financeResponse.providerResponse,
                            startTrace: 'not implemented yet',
                          },
                        };
                        return from(
                          this.transactionService.update(
                            financeRequest.id,
                            update,
                          ),
                        );
                      }
                      const update = {
                        fees: financeResponse.providerResponse.fees ?? 0,
                        payToken: financeResponse.providerResponse.payToken,
                        state: State.FAILED,
                        report: {
                          startLog: financeResponse.providerResponse,
                          startTrace: 'not implemented yet',
                        },
                      };
                      return from(
                        this.transactionService.update(
                          financeRequest.id,
                          update,
                        ),
                      );
                    }),
                  );
                }),
              );
            }),
          ),
        );
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }

  getStatus(id: string) {
    throw new Error('Method not implemented.');
  }

  loadProvider(request: OperationRequest): Observable<PaymentProvider> {
    if (request.providerCode)
      return this.paymentProviderService.findByCode(request.providerCode);
    return from(
      this.paymentProviderService.findSuitableProvider(
        request.amount.destinationAmount,
      ),
    );
  }
}
