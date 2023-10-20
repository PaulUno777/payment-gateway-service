import { ProviderCode } from '@prisma/client';

export const arrayProviderCode = (): string[] => {
  const providerArray = Object.values(ProviderCode);
  return providerArray;
};
