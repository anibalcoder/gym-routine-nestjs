import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'roles';

export enum ValidRoles {
  User = 'user',
  Admin = 'admin',
}

export const Roles = (roles: ValidRoles[]) => {
  return SetMetadata(META_ROLES, roles);
};
