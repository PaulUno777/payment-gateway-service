import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { MomoService } from 'src/momo/momo.service';
import { PhoneHelperService } from '@app/phone-helper';
import { PaymentProviderService } from 'src/payment-provider/payment-provider.service';
import { Observable, catchError, from, map, switchMap } from 'rxjs';
import { UserInfo } from './dto/operation-response.dto';
import { ProviderCode, Transaction } from '@prisma/client';
import { OperatorGatewayLoader } from './operator-gateway.loader';
import { UserInfosProvider } from '@app/common/interfaces';

@Injectable()
export class OperationService {
  private readonly logger = new Logger(OperationService.name);
  constructor(
    private phoneHelper: PhoneHelperService,
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
            return {
              firstName: response.providerResponse.userData.firstname,
              lastName: response.providerResponse.userData.lastname,
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

  getStatus(id: string) {
    throw new Error('Method not implemented.');
  }
  cashin(createOperationDto: CreateOperationDto) {
    throw new Error('Method not implemented.');
  }
  cashout(createOperationDto: CreateOperationDto) {
    throw new Error('Method not implemented.');
  }
  create(createOperationDto: CreateOperationDto) {
    return 'This action adds a new operation';
  }

  // loadProvider(transaction: Transaction) {
  //   if (transaction.providerCode)
  //     return this.paymentProviderService.findByCode(transaction.providerCode);
  // }

  findOne(id: number) {
    return `This action returns a #${id} operation`;
  }

  update(id: number, updateOperationDto: UpdateOperationDto) {
    return `This action updates a #${id} operation`;
  }

  remove(id: number) {
    return `This action removes a #${id} operation`;
  }
}
