import { CountryCode } from 'libphonenumber-js';

export interface IPhoneHelper {
  applyCountry: CountryCode;
  getProviderCodeByMsisdn(phoneNumber: string): string;

  formatPhoneNumber(phoneNumber: string, applyCountry?: string): string;
}
