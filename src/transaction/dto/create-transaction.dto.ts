import { ApiProperty } from '@nestjs/swagger';
import { Mouvement, ProviderCode } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, ValidateNested } from 'class-validator';
import {
  Amount,
  RecipientDetails,
  SenderDetails,
  Source,
} from './transaction.type.dto';

export class CreateTransactionRequest {
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

  @ApiProperty({ description: '', default: 'MTN_MOBILE_MONEY' })
  @IsIn(['ORANGE_MONEY', 'MTN_MOBILE_MONEY', 'INTOUCH', 'AUTO_USSD'])
  PrividerCode?: ProviderCode;

  @ApiProperty({ description: '' })
  @IsIn(['DEPOSIT', 'WITHDRAWAL'])
  mouvement?: Mouvement;
}
