import { IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProviderParams {
  @IsBoolean()
  @ApiProperty()
  isDepositAvailable: boolean;

  @IsBoolean()
  @ApiProperty()
  isWithdrawalAvailable: boolean;

  @IsBoolean()
  @ApiProperty()
  isCustomerInfoAvailable: boolean;

  @IsBoolean()
  @ApiProperty()
  isBalanceInfoAvailable;

  @Min(1)
  @ApiProperty()
  minimumThreshold: number;

  @Min(1)
  @ApiProperty()
  maximumThreshold: number;
}
