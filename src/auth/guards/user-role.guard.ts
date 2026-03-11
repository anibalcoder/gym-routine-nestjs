/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES, ValidRoles } from '../decorators/roles.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: ValidRoles[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!roles || roles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    for (const rol of roles) {
      if (user.roles.includes(rol)) return true;
    }

    throw new ForbiddenException(
      `Acceso denegado. Solo los roles [${roles.join(', ')}] pueden acceder a este recurso.`,
    );
  }
}
