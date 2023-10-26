import { ProviderCode, ProviderType } from '@prisma/client';

export class DefaultConfiguration {
  makeTransactionAuto = false;

  origineCurrenciesAvailable: string[] = ['EUR', 'USD', 'XAF', 'CAD'];

  destinationCurrenciesAvailable: string[] = ['XAF'];

  ProviderCodeAvailable: string[] = Object.keys(ProviderCode);

  ProviderTypeAvailable: string[] = Object.keys(ProviderType);
}
