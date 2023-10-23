import { ApiProperty } from '@nestjs/swagger';
import { ProviderCode } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, ValidateNested, IsOptional } from 'class-validator';
import {
  Amount,
  RecipientDetails,
  SenderDetails,
} from '../../../libs/common/src/types/transaction.type.dto';

export class AllTransactionRequest {
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
