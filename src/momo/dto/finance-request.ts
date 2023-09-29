import { ApiProperty } from '@nestjs/swagger';
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
  @IsString()
  externalId: string;

  @ApiProperty()
  @IsIn(['MTN_MOBILE_MONEY', 'ORANGE_MONEY', 'INTOUCH'])
  providerCode: string;

  @ApiProperty()
  @IsString()
  apiClient: string;
}
