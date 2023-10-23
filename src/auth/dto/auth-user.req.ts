import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class AuthUserReq {
  @ApiProperty({ default: 'abc@gmail.com or userName' })
  @MinLength(4)
  login: string;
  @MinLength(4)
  @ApiProperty()
  password: string;
}
