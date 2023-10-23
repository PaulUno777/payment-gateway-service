import {
  DESTINATION_CURRENCIES_AVAILABLE,
  ORIGINAL_CURRENCIES_AVAILABLE,
} from '@app/common/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  ValidateNested,
  IsNumberString,
  IsIn,
} from 'class-validator';

export class ConvertCurrencyRequest {
  @ApiProperty()
  @IsIn(ORIGINAL_CURRENCIES_AVAILABLE)
  from: string;

  @ApiProperty()
  @IsIn(DESTINATION_CURRENCIES_AVAILABLE)
  to: string;

  @ApiProperty()
  @IsNumberString()
  amount: string;
}

class Result {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  rate: number;
}

export class ConvertCurrencyResponse {
  @ApiProperty()
  @Type(() => ConvertCurrencyRequest)
  @ValidateNested()
  query: ConvertCurrencyRequest;

  @ApiProperty()
  @IsString()
  updatedAt: string = new Date().toISOString().split('T')[0];

  @ApiProperty()
  @ValidateNested()
  @Type(() => Result)
  result: Result;
}
