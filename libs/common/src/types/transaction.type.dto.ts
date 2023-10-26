import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ExecutionReport,
  Mouvement,
  ProviderCode,
  ProviderType,
  SourceType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsISO31661Alpha2,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  DESTINATION_CURRENCIES_AVAILABLE,
  ORIGINAL_CURRENCIES_AVAILABLE,
} from '../constants';

class PayeeId {
  @ApiProperty({ default: 'MOBILE_MONEY' })
  @IsIn(Object.values(ProviderType))
  partyIdType: ProviderType;

  @ApiProperty({ default: '679218039' })
  @IsString()
  partyId: string;
}

export class Source {
  @ApiProperty({ description: '' })
  @IsString()
  name: string;

  @ApiProperty({ description: '' })
  @IsString()
  entityId: string;

  @ApiProperty({ description: '', default: 'SERVICE' })
  @IsIn(Object.values(SourceType))
  type: SourceType;
}

export class SenderDetails {
  @ApiProperty({ description: '', default: 'Kamix Client' })
  @IsString()
  id: string;

  @ApiProperty({ description: '', default: 'Kamix Client' })
  @IsOptional()
  name: string;

  @ApiProperty({ description: '', default: 'FR' })
  @IsISO31661Alpha2()
  country: string;
}

export class RecipientDetails {
  @ApiProperty({ description: '' })
  @ValidateNested()
  @Type(() => PayeeId)
  payeeId: PayeeId;

  @ApiPropertyOptional({ description: '', default: 'Optional' })
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '', default: 'CM' })
  @IsISO31661Alpha2()
  country: string;
}

export class Amount {
  @ApiProperty({ description: 'Original currency', default: 'XAF' })
  @IsIn(ORIGINAL_CURRENCIES_AVAILABLE)
  originalCurrency: string;

  @ApiProperty({ description: 'Original amount', default: 1 })
  @Min(1)
  originalAmount: number;

  @ApiProperty({ description: 'Destination currency', default: 'XAF' })
  @IsIn(DESTINATION_CURRENCIES_AVAILABLE)
  destinationCurrency: string;

  @ApiProperty({ description: 'Destination amount', default: 1 })
  @Min(1)
  destinationAmount: number;

  @ApiProperty({ description: 'Exchange rate', default: 1 })
  @IsNumber()
  exchangeRate: number;
}

export class TransactionEntity {
  @ApiProperty({ description: '' })
  id: string;

  @ApiProperty({ description: '' })
  createdAt: Date;

  @ApiProperty({ description: '' })
  CompletedAt: Date;

  @ApiProperty({ description: '' })
  source: Source;

  @ApiProperty({ description: '' })
  senderDetails: SenderDetails;

  @ApiProperty({ description: '' })
  recipientDetails: RecipientDetails;

  @ApiProperty({ default: 0 })
  amount: Amount;

  @ApiProperty({ default: 0 })
  fees: Date;

  @ApiPropertyOptional({ description: '' })
  callbackUrl?: string;

  @ApiProperty({ description: '' })
  payToken?: string;

  @ApiProperty({ description: '' })
  description: string;

  @ApiProperty({
    description: 'The direction of tansaction',
    default: Mouvement.WITHDRAWAL,
  })
  mouvement: Mouvement;

  @ApiProperty({ default: [] })
  executionReports: ExecutionReport[];

  @ApiProperty({ default: ProviderCode.CM_INTOUCH })
  providerCode: ProviderCode;
}
