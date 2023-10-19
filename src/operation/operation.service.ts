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

@Injectable()
export class OperationService {
  private readonly logger = new Logger(OperationService.name);
  constructor(
    private phoneHelper: PhoneHelperService,
    private readonly momoService: MomoService,
    private readonly paymentProviderService: PaymentProviderService,
  ) {}

  getSubscriberInfos(country: string, msisdn: string): Observable<UserInfo> {
    this.logger.log("Retrieving the subscriber's information");
    const helper = this.phoneHelper.load(country);
    const formatedNumber = helper.formatPhoneNumber(msisdn, country);
    const providerCode = helper.getProviderCodeByMsisdn(formatedNumber);
    return from(this.paymentProviderService.findByCode(providerCode)).pipe(
      switchMap((provider) => {
        console.log(provider);
        if (!provider.params.isCustomerInfoAvailable || !provider.isActive) {
          throw new ServiceUnavailableException(
            'This Service is currently unavailable for this provider',
          );
        }
        const request = {
          phoneNumber: formatedNumber,
          providerCode: provider.code,
        };
        return from(this.momoService.checkUserInfos(request)).pipe(
          map((response) => {
            return {
              firstName: response.providerResponse.userData.firstname,
              lastName: response.providerResponse.userData.lastname,
            };
          }),
        );
      }),
      catchError((error) => {
        throw error;
      }),
    );

    throw new Error('Method not implemented.');
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

  findAll() {
    return `This action returns all operation`;
  }

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
