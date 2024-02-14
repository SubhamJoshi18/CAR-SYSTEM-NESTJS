import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function CurrentUser() {
  createParamDecorator((data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session);
    return request.currentUser;
  });
}
