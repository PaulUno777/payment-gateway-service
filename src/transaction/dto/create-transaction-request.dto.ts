import {
  Amount,
  RecipientDetails,
  SenderDetails,
  Source,
} from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { Mouvement, ProviderCode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsOptional,
  IsUrl,
  Length,
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

  @ApiProperty()
  @IsIn(Object.values(Mouvement))
  mouvement: Mouvement;
}