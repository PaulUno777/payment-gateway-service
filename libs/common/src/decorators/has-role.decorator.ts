/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import {} from '@prisma/client';
import { RoleType } from 'src/auth/types/role-type';

export const HasRole = (...hasRoles: RoleType[]) =>
  SetMetadata('roles', hasRoles);
