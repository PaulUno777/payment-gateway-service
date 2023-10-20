import { arrayProviderCode } from '@app/common';
import { Amount, RecipientDetails, SenderDetails } from '@app/common/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProviderCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class OperationRequest {
  @ApiProperty({ description: '' })
  @ValidateNested()
  @Type(() => SenderDetails)
  senderDetails: SenderDetails;

  @ApiProperty({ description: '' })
  @ValidateNested()
  @Type(() => RecipientDetails)
  recipientDetails: RecipientDetails;

  @ApiProperty({ default: '' })
  @MinLength(10)
  @MaxLength(128)
  description: string;

  @ApiPropertyOptional({ default: 'Optional' })
  @IsOptional()
  @IsUrl()
  callbackUrl?;

  @ApiProperty({ description: '' })
  @ValidateNested()
  @Type(() => Amount)
  amount: Amount;

  @ApiPropertyOptional({ description: '', default: 'Optional' })
  @IsIn(arrayProviderCode())
  @IsOptional()
  providerCode?: ProviderCode;
}
