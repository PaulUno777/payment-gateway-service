import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
export class StatusRequest {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  payToken: string;

  @ApiProperty()
  @IsString()
  Mouvement: string;

  @ApiProperty()
  @IsIn(['MTN_MOBILE_MONEY', 'ORANGE_MONEY', 'INTOUCH'])
  providerCode: string;
}
