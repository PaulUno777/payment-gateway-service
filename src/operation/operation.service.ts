import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OperationRequest } from './dto/operation-request';
import { PhoneHelperService } from '@app/phone-helper';
import { PaymentProviderService } from 'src/payment-provider/payment-provider.service';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { UserInfo } from './dto/operation-response.dto';
import { Mouvement, PaymentProvider, State, Transaction } from '@prisma/client';
import { OperatorGatewayLoader } from './operator-gateway.loader';
import {
  CashInProvider,
  CashOutProvider,
  UserInfosProvider,
} from '@app/common/interfaces';
import { TransactionService } from 'src/transaction/transaction.service';
import { CreateTransactionRequest } from 'src/transaction/dto/transaction-request.dto';
import { ConfigurationService } from 'src/configuration/configuration.service';

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
  ) {}

  getSubscriberInfos(
    countryAlpha2: string,
    partyIdType: string,
    partyId: string,
  ): Observable<UserInfo> {
    this.logger.log("Retrieving the subscriber's information");

    const country = countryAlpha2.toUpperCase();

    const helper = this.phoneHelper.load(country, partyIdType);

    const formatedNumber = helper.formatPhoneNumber(partyId, country);

    const operatorCode = helper.getProviderCodeByMsisdn(formatedNumber);

    return from(this.paymentProviderService.findByCode(operatorCode)).pipe(
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

  initiateTransaction(transaction: Transaction): Observable<any> {
    return from(this.loadProvider(transaction)).pipe();
    throw 'methods not implemented';
  }

  // cashout(currentSource, operationRequest: OperationRequest) {
  //   const source = {
  //     name: currentSource.email,
  //     type: currentSource.type,
  //     entityId: currentSource.sub,
  //   };
  //   const mouvement = Mouvement.DEPOSIT;
  //   return from(this.loadProvider(operationRequest)).pipe(
  //     switchMap((provider) => {
  //       if (!provider.params.isDepositAvailable) {
  //         throw new ServiceUnavailableException(
  //           `Collection is currently unavailable on provider ${provider.code}`,
  //         );
  //       }
  //       return from(
  //         this.getSubscriberInfos(
  //           operationRequest.recipientDetails.country,
  //           operationRequest.recipientDetails.id,
  //         ).pipe(
  //           switchMap((userInfo) => {
  //             const request = {
  //               ...operationRequest,
  //               source,
  //               mouvement,
  //               operatorCode: userInfo.provider,
  //               providerCode: provider.code,
  //             };
  //             request.recipientDetails.name = userInfo.fullName;
  //             request.recipientDetails.id = userInfo.msisdn;
  //             return from(this.transactionService.create(request)).pipe(
  //               switchMap((transaction) => {
  //                 const provider: CashOutProvider =
  //                   this.operatorGatewayLoader.load(transaction.providerCode);
  //                 const financeRequest = {
  //                   id: transaction.id,
  //                   amount: transaction.amount.destinationAmount,
  //                   payerPhone: transaction.recipientDetails.id,
  //                   description: transaction.description,
  //                   externalId: transaction.id,
  //                   providerCode: transaction.providerCode,
  //                   apiClient: transaction.senderDetails.id,
  //                 };
  //                 return from(provider.cashOut(financeRequest)).pipe(
  //                   switchMap((financeResponse) => {
  //                     if (financeResponse.success) {
  //                       const update = {
  //                         fees: financeResponse.providerResponse.fees ?? 0,
  //                         payToken: financeResponse.providerResponse.payToken,
  //                         report: {
  //                           startLog: financeResponse.providerResponse,
  //                           startTrace: 'not implemented yet',
  //                         },
  //                       };
  //                       return from(
  //                         this.transactionService.update(
  //                           financeRequest.id,
  //                           update,
  //                         ),
  //                       );
  //                     }
  //                     const update = {
  //                       fees: financeResponse.providerResponse.fees ?? 0,
  //                       payToken: financeResponse.providerResponse.payToken,
  //                       state: State.FAILED,
  //                       report: {
  //                         startLog: financeResponse.providerResponse,
  //                         startTrace: 'not implemented yet',
  //                       },
  //                     };
  //                     return from(
  //                       this.transactionService.update(
  //                         financeRequest.id,
  //                         update,
  //                       ),
  //                     );
  //                   }),
  //                 );
  //               }),
  //             );
  //           }),
  //         ),
  //       );
  //     }),
  //     catchError((error) => {
  //       throw error;
  //     }),
  //   );
  // }

  // getStatus(id: string) {
  //   throw new Error('Method not implemented.');
  // }

  loadProvider(transaction: Transaction): Observable<PaymentProvider> {
    if (transaction.providerCode)
      return this.paymentProviderService.findByCode(transaction.providerCode);
    return from(
      this.paymentProviderService.findSuitableProvider(
        transaction.amount.destinationAmount,
      ),
    );
  }

  checkConfiguration() {
    this.isAutomatic =
      this.configuration.getConfig().makeTransactionAuto || false;
  }
}
