import { ApiProperty } from '@nestjs/swagger';
import { ProviderCode } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, ValidateNested } from 'class-validator';
import {
  Amount,
  RecipientDetails,
  SenderDetails,
} from '../../../libs/common/src/types/transaction.type.dto';

export class TransactionRequest {
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
  @IsIn([
    'ORANGE_MONEY',
    'MTN_MOBILE_MONEY',
    'INTOUCH',
    'AUTO_USSD',
    'AUTOMATIC',
  ])
  PrividerCode?: ProviderCode;
}
