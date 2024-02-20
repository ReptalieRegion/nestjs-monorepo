import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AdminProfile } from '../types/guards/admin.types';

export const AuthUser = createParamDecorator(async (data: Array<keyof AdminProfile>, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest<Request>().user as AdminProfile;
    return data
        ? data.reduce((prev, filed) => {
              return { ...prev, [filed]: user[filed] };
          }, {})
        : user;
});
