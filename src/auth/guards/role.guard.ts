import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRoles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    const userWithRole = await this.userService.findUserWithTheRole(user.id);
    const userRole = userWithRole.toJSON().role.name;
    return requireRoles.some((role) => userRole.includes(role));
  }
}
