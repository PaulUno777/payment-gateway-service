import { Amount, RecipientDetails, SenderDetails } from '@app/common/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProviderCode } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsIn, ValidateNested } from 'class-validator';

export class CreateOperationDto {
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

  @ApiPropertyOptional({ description: '', default: 'AUTOMATIC' })
  @IsIn(['ORANGE_MONEY', 'MTN_MOBILE_MONEY', 'INTOUCH', 'AUTO_USSD'])
  PrividerCode?: ProviderCode;
}
