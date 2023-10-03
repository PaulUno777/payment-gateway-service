import {
  IsBoolean,
  IsISO31661Alpha2,
  IsIn,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderCode, ProviderType } from '@prisma/client';
import { Type } from 'class-transformer';
import { ProviderParams } from './provider-params';

export class CreatePaymentProviderRequest {
  @IsOptional()
  @ApiProperty()
  label: string;

  @IsIn(['MTN_MOBILE_MONEY', 'ORANGE_MONEY', 'INTOUCH', 'AUTO_USSD'])
  @ApiProperty({ default: 'SAMPLE_CODE' })
  code: ProviderCode;

  @IsIn(['MOBILE_MONEY', 'BANKING', 'CASH'])
  @ApiProperty({ default: 'MOBILE_MONEY' })
  type: ProviderType;

  @IsISO31661Alpha2()
  @ApiProperty({ default: 'CM' })
  applyCountry: string;

  @IsOptional()
  @ApiProperty()
  logo: string;

  @IsBoolean()
  @ApiProperty()
  isActive: boolean;

  @ValidateNested()
  @Type(() => ProviderParams)
  @ApiProperty()
  params: ProviderParams;
}
