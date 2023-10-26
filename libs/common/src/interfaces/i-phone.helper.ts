import { ProviderType, ProviderCode } from '@prisma/client';
import { CountryCode } from 'libphonenumber-js';

export interface IPhoneHelper {
  applyCountry: CountryCode;
  partyIdType: ProviderType;
  getProviderCodeByMsisdn(phoneNumber: string): ProviderCode;

  formatPhoneNumber(phoneNumber: string, applyCountry?: string): string;
}
