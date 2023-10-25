import { arrayProviderCode } from '@app/common';
import { Amount, RecipientDetails, SenderDetails } from '@app/common/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProviderCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsOptional,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';

export class OperationRequest {
  @ApiProperty({ description: 'Informations about the sender' })
  @ValidateNested()
  @Type(() => SenderDetails)
  senderDetails: SenderDetails;

  @ApiProperty({ description: 'Informations about the recipient' })
  @ValidateNested()
  @Type(() => RecipientDetails)
  recipientDetails: RecipientDetails;

  @ApiProperty({ description: '' })
  @ValidateNested()
  @Type(() => Amount)
  amount: Amount;

  @ApiProperty({ default: '' })
  @Length(8, 127)
  description: string;

  @ApiPropertyOptional({ default: 'Optional' })
  @IsOptional()
  @IsUrl()
  callbackUrl?;

  @ApiPropertyOptional({ description: '', default: 'Optional' })
  @IsIn(arrayProviderCode())
  @IsOptional()
  providerCode?: ProviderCode;
}
