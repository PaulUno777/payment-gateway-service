import {
  Amount,
  RecipientDetails,
  SenderDetails,
  Source,
} from '@app/common/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Mouvement, ProviderCode, State } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsUrl,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateTransactionRequest {
  @ApiProperty()
  @ValidateNested()
  @Type(() => Source)
  source: Source;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SenderDetails)
  senderDetails: SenderDetails;

  @ApiProperty()
  @ValidateNested()
  @Type(() => RecipientDetails)
  recipientDetails: RecipientDetails;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Amount)
  amount: Amount;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  callbackUrl?: string;

  @ApiProperty()
  @Length(4, 127)
  description: string;

  operatorCode: ProviderCode;

  @ApiProperty()
  @IsIn(Object.values(Mouvement))
  mouvement: Mouvement;
}

export class UpdateTransactionRequest {
  fees?: number;

  payToken?: string;

  state?: State;

  providerCode?: ProviderCode;
}

export class PageableTransaction {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 15 })
  @IsOptional()
  @Min(1)
  size?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  sort?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  filter?: string[];
}
