import { IsArray, IsIn, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProviderCode, ProviderType } from '@prisma/client';
import { Type } from 'class-transformer';
import { ProviderParams } from './provider-params';

export class CreatePaymentProviderRequest {
  @IsOptional()
  @ApiProperty()
  label: string;

  @IsIn(Object.values(ProviderCode))
  @ApiProperty({ default: 'SAMPLE_CODE' })
  code: ProviderCode;

  @IsIn(Object.values(ProviderType))
  @ApiProperty({ default: 'MOBILE_MONEY' })
  type: ProviderType;

  @IsArray()
  @ApiProperty({ default: ['CMR'] })
  applyCountry: string[];

  @IsOptional()
  @ApiProperty()
  logo: string;

  @ValidateNested()
  @Type(() => ProviderParams)
  @ApiProperty()
  params: ProviderParams;
}
