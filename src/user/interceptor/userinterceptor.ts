import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const newId = request.session.userId;
    const find = this.userService.findbyid(newId);

    request.currentUser = find;

    return handler.handle();
  }
}
