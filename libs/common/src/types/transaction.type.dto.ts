import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Mouvement, ProviderCode, SourceType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsISO31661Alpha3,
  IsIn,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  DESTINATION_CURRENCIES_AVAILABLE,
  ORIGINAL_CURRENCIES_AVAILABLE,
} from '../constants';

export class ExecutionReport {
  @ApiProperty({ description: '' })
  startLog?: any;

  @ApiProperty({ description: '' })
  startSignature?: string;

  @ApiProperty({ description: '' })
  endLog?: any;

  @ApiProperty({ description: '' })
  endSignature?: string;
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
  @ApiProperty({ description: '' })
  @IsString()
  id: string;

  @ApiProperty({ description: '' })
  @IsOptional()
  name: string;

  @ApiProperty({ description: '', default: 'CMR' })
  @IsISO31661Alpha3()
  country: string;
}

export class RecipientDetails {
  @ApiProperty({ description: '' })
  @IsNumberString()
  id: string;

  @ApiPropertyOptional({ description: '', default: 'Optional' })
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '', default: 'CMR' })
  @IsISO31661Alpha3()
  country: string;
}

export class Amount {
  @ApiProperty({ description: 'Original currency' })
  @IsIn(ORIGINAL_CURRENCIES_AVAILABLE)
  originalCurrency: string;

  @ApiProperty({ description: 'Original amount', default: 1 })
  @Min(1)
  originalAmount: number;

  @ApiProperty({ description: 'Destination currency' })
  @IsIn(DESTINATION_CURRENCIES_AVAILABLE)
  destinationCurrency: string;

  @ApiProperty({ description: 'Destination amount', default: 1 })
  @Min(1)
  destinationAmount: number;

  @ApiProperty({ description: 'Exchange rate', default: 0 })
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
  @ValidateNested()
  @Type(() => Source)
  source: Source;

  @ApiProperty({ description: '' })
  @ValidateNested()
  @Type(() => SenderDetails)
  senderDetails: SenderDetails;

  @ApiProperty({ description: '' })
  @ValidateNested()
  @Type(() => RecipientDetails)
  recipientDetails: RecipientDetails;

  @ApiProperty({ description: '' })
  @ValidateNested()
  @Type(() => Amount)
  amount: Amount;

  @ApiPropertyOptional({ description: '' })
  @IsOptional()
  PrividerCode: ProviderCode;

  @ApiProperty({ default: 0 })
  fees: Date;

  @ApiProperty({ description: '' })
  callbackUrl?: string;

  @ApiProperty({ description: '' })
  payToken?: string;

  @ApiProperty({ description: '' })
  description: string;

  @ApiProperty({
    description: 'The direction of tansaction',
    default: 'WITHDRAWAL',
  })
  mouvement: Mouvement;

  @ApiProperty({ description: '' })
  @ValidateNested()
  @Type(() => ExecutionReport)
  report: ExecutionReport;
}
