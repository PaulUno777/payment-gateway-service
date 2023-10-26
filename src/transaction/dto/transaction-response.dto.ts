import { Amount, RecipientDetails, SenderDetails } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderCode, State } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, ValidateNested, IsOptional } from 'class-validator';

export class AllTransactionResponse {
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

  @ApiProperty({ description: '', default: 'Optional' })
  @IsIn(Object.values(ProviderCode))
  @IsOptional()
  PrividerCode?: ProviderCode;
}

export interface PendingTransactionResponse {
  id: string;
  state: State;
  providerCode: ProviderCode;
}
