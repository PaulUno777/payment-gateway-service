import { OperatorCode } from '@prisma/client';
import { CountryCode } from 'libphonenumber-js';

export interface IPhoneHelper {
  applyCountry: CountryCode;
  getProviderCodeByMsisdn(phoneNumber: string): OperatorCode;

  formatPhoneNumber(phoneNumber: string, applyCountry?: string): string;
}
