import { ApiProperty } from '@nestjs/swagger';
import { ProviderCode, ProviderType } from '@prisma/client';
import { IsArray, IsBoolean } from 'class-validator';

export class DefaultConfiguration {
  @ApiProperty({ default: false })
  @IsBoolean()
  makeTransactionAuto = false;

  @ApiProperty({ default: ['EUR', 'USD', 'XAF', 'CAD'] })
  @IsArray()
  origineCurrenciesAvailable: string[] = ['EUR', 'USD', 'XAF', 'CAD'];

  @ApiProperty({ default: ['XAF'] })
  @IsArray()
  destinationCurrenciesAvailable: string[] = ['XAF'];

  @ApiProperty({ default: Object.keys(ProviderCode) })
  @IsArray()
  ProviderCodeAvailable: string[] = Object.keys(ProviderCode);

  @ApiProperty({ default: Object.keys(ProviderType) })
  @IsArray()
  ProviderTypeAvailable: string[] = Object.keys(ProviderType);
}
