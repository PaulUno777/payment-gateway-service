import { ApiProperty } from '@nestjs/swagger';

export class AuthUserRes {
  @ApiProperty()
  auth_token: string;
  @ApiProperty()
  refresh_token: string;
}
