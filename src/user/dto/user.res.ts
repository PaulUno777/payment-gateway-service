import { RoleType } from '@app/common/prisma/client-auth';
import { ApiProperty } from '@nestjs/swagger';

export class UserRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  uid: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  role: RoleType;
}
