import { BadRequestException, Injectable } from '@nestjs/common';
import { OperatorCode } from '@prisma/client';
import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js';
import { IPhoneHelper } from '@app/common/interfaces';

@Injectable()
export class CmPhoneHelper implements IPhoneHelper {
  applyCountry: CountryCode;
  constructor() {
    this.applyCountry = 'CM';
  }

  formatPhoneNumber(phoneNumber: string): string {
    const number = parsePhoneNumberFromString(phoneNumber, this.applyCountry);
    const formatedNumber = number
      ? number.formatInternational().replace(/[\s+]/g, '')
      : null;
    if (formatedNumber == null)
      throw new BadRequestException(
        'The provided phoneNumber is not valid for this country',
      );

    return formatedNumber;
  }

  getProviderCodeByMsisdn(phoneNumber: string): OperatorCode {
    if (phoneNumber.length != 9 && phoneNumber.length != 12)
      throw new BadRequestException(
        'The provided phoneNumber is not valid for this country',
      );

    const MTN = [
      '650',
      '651',
      '652',
      '653',
      '654',
      '670',
      '671',
      '672',
      '673',
      '674',
      '675',
      '676',
      '677',
      '678',
      '679',
      '680',
      '681',
      '682',
      '683',
      '684',
      '685',
      '686',
      '687',
      '688',
      '689',
    ];
    const ORANGE = [
      '690',
      '691',
      '692',
      '693',
      '694',
      '695',
      '696',
      '697',
      '698',
      '699',
      '655',
      '656',
      '657',
      '658',
      '659',
    ];
    const prefix =
      phoneNumber.length > 9
        ? phoneNumber.substring(3, 6)
        : phoneNumber.substring(0, 3);

    if (MTN.includes(prefix)) {
      return OperatorCode.MTN_MOBILE_MONEY;
    } else if (ORANGE.includes(prefix)) {
      return OperatorCode.ORANGE_MONEY;
    } else {
      throw new BadRequestException(
        'The provided phoneNumber is not valid for this country',
      );
    }
  }
}
