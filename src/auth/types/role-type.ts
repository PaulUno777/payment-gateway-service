/* eslint-disable prettier/prettier */
export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const RoleType = {
  super_admin: 'super_admin',
  client_manager: 'client_manager',
  manage_users: 'manage_users',
  all: 'all',
  new_role: 'new_role',
  api_client: 'api_client',
};
