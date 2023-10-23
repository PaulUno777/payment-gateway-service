/* eslint-disable prettier/prettier */
import { Role } from '@app/common/prisma/client-auth';
import { SourceType } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  type: SourceType;
};
