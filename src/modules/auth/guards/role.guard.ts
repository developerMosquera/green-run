import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest();
      const userRoles = request.headers?.role?.split(',');
      const isValidRol = this.validateRoles(roles, userRoles);
      if (isValidRol) {
        return true;
      }

      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException('Invalid Role');
    }
  }

  validateRoles(roles: string[], userRoles: string[]) {
    return roles.some((role) => userRoles.includes(role));
  }
}
