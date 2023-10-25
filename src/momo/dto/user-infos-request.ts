import { ApiProperty } from '@nestjs/swagger';
import { ProviderCode } from '@prisma/client';
import { IsIn, IsNumberString } from 'class-validator';

export class UserInfosRequest {
  @ApiProperty()
  @IsNumberString()
  phoneNumber: string;

  @ApiProperty()
  @IsIn(Object.keys(ProviderCode))
  providerCode: string;
}
