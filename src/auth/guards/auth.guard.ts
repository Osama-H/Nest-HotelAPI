import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException("You're not loggedIn");

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'at-secret',
      });

      const foundUser = await this.userService.findUserByEmail(payload.email);
      if (!foundUser) {
        throw new UnauthorizedException('User not found');
      }
      request['user'] = foundUser;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
