import { ApiProperty } from '@nestjs/swagger';
import { SourceType } from '@prisma/client';
import { IsISO31661Alpha2 } from 'class-validator';

export class ExecutionReport {
  startLog?: string;
  startSignature?: string;
  endLog?: string;
  endSignature?: string;
}

export class Source {
  name: string;
  entityId: string;
  type: SourceType;
}

export class SenderDetails {
  id: string;

  name: string;

  @ApiProperty({ description: '' })
  @IsISO31661Alpha2()
  country: string;
}

export class RecipientDetails {
  id: string;
  name?: string;
  country: string;
}

export class Amount {
  originalCurrency: string;
  originalAmount: number;
  destinationCurrency: string;
  destinationAmount: number;
  exchangeRate: number;
}
