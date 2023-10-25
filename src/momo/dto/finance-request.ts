import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProviderCode } from '@prisma/client';
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

  @ApiPropertyOptional()
  payToken?: string;

  @ApiProperty()
  @IsIn(Object.values(ProviderCode))
  providerCode: string;
}
