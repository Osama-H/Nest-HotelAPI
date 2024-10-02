import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUserRoles = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): string[] => {
    const request = context.switchToHttp().getRequest();
    return request.user.role.name || [];
  },
);
