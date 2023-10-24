/* eslint-disable prettier/prettier */
import { SourceType } from '@prisma/client';
import { RoleType } from './role-type';

export type JwtPayload = {
  sub: string;
  email: string;
  role: RoleType;
  type: SourceType;
};
