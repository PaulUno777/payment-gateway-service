import { ApiProperty } from '@nestjs/swagger';
import { ProviderType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ProviderParams } from './provider-params';

export class UpdatePaymentProviderRequest {
  @IsOptional()
  @ApiProperty()
  label?: string;

  @IsOptional()
  @IsIn(Object.values(ProviderType))
  @ApiProperty({ default: 'MOBILE_MONEY' })
  type?: ProviderType;

  @IsOptional()
  @IsArray()
  @ApiProperty({ default: ['CM'] })
  applyCountry?: string[];

  @IsOptional()
  @ApiProperty()
  logo?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isActive?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProviderParams)
  @ApiProperty()
  params?: ProviderParams;
}
