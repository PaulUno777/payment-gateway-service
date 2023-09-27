/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { RoleType } from '@prisma/client';

export const HasRole = (...hasRoles: RoleType[]) =>
  SetMetadata('roles', hasRoles);
