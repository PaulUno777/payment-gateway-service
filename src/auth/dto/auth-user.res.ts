import { ApiProperty } from '@nestjs/swagger';

export class AuthUserRes {
  @ApiProperty()
  authToken: string;
  @ApiProperty()
  refreshToken: string;
}
