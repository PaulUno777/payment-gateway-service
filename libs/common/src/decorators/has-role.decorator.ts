/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import {  } from '@prisma/client';
import { RoleType } from '../prisma/client-auth';

export const HasRole = (...hasRoles: RoleType[]) =>
  SetMetadata('roles', hasRoles);
