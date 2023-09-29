import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsPhoneNumber } from 'class-validator';

export class UserInfosRequest {
  @ApiProperty()
  @IsPhoneNumber('CM', { message: 'Cameroun number only' })
  phoneNumber: string;

  @ApiProperty()
  @IsIn(['MTN_MOBILE_MONEY', 'ORANGE_MONEY', 'INTOUCH'])
  providerCode: string;
}
