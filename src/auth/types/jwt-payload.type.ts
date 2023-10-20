/* eslint-disable prettier/prettier */
import { Role, SourceType } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  type: SourceType;
};
