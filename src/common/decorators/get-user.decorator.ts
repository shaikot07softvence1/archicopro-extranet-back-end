/* eslint-disable @typescript-eslint/no-unsafe-return */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../types/user.type';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
