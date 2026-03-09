import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRoleGuard } from '../guards/user-role.guard';
import { Roles, ValidRoles } from './roles.decorator';
import { AuthGuard } from '@nestjs/passport';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    Roles([...roles]),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
