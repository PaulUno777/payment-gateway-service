import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsMobilePhone, IsString, Min } from 'class-validator';

export class FinanceRequest {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @Min(1)
  amount: number;

  @ApiProperty()
  @IsMobilePhone()
  payerPhone: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  callbackUrl: string;

  @ApiProperty()
  @IsString()
  externalId: string;

  @ApiProperty()
  payToken: string;

  @ApiProperty()
  @IsIn(['MTN_MOBILE_MONEY', 'ORANGE_MONEY', 'INTOUCH'])
  providerCode: string;

  @ApiPropertyOptional()
  apiClient: string;
}
