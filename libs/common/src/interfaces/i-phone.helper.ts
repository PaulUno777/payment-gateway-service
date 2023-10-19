import { ProviderCode } from '@prisma/client';
import { CountryCode } from 'libphonenumber-js';

export interface IPhoneHelper {
  applyCountry: CountryCode;
  getProviderCodeByMsisdn(phoneNumber: string): ProviderCode;

  formatPhoneNumber(phoneNumber: string, applyCountry?: string): string;
}
