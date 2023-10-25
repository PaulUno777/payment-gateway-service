import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTokenRes {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  tokenType: string;

  @ApiProperty()
  @IsString()
  expiresIn?: number;
}
