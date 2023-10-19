import { ApiProperty } from '@nestjs/swagger';
import { Mouvement, ProviderCode, SourceType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsCurrency,
  IsISO31661Alpha2,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

export class ExecutionReport {
  @ApiProperty({ description: '' })
  startLog?: string;
  @ApiProperty({ description: '' })
  startSignature?: string;
  @ApiProperty({ description: '' })
  endLog?: string;
  @ApiProperty({ description: '' })
  endSignature?: string;
}

export class Source {
  @ApiProperty({ description: '' })
  name: string;
  @ApiProperty({ description: '' })
  entityId: string;
  @ApiProperty({ description: '', default: 'SERVICE' })
  type: SourceType;
}

export class SenderDetails {
  @ApiProperty({ description: '' })
  id: string;
  @ApiProperty({ description: '' })
  name: string;
  @ApiProperty({ description: '' })
  @IsISO31661Alpha2()
  country: string;
}

export class RecipientDetails {
  @ApiProperty({ description: '' })
  id: string;
  @ApiProperty({ description: '' })
  name?: string;
  @ApiProperty({ description: '' })
  country: string;
}

export class Amount {
  @ApiProperty({ description: 'Original currency' })
  @IsCurrency()
  originalCurrency: string;

  @ApiProperty({ description: 'Original amount', default: 1 })
  @Min(1)
  originalAmount: number;

  @ApiProperty({ description: 'Destination currency' })
  @IsCurrency()
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

  @ApiProperty({ description: '', default: 'AUTOMATIC' })
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
