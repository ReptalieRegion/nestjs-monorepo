import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { UserDocument } from '../../schemas/user.schema';

export const AuthUser = createParamDecorator((data: keyof UserDocument, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest<Request>().user as UserDocument;

    return data ? user && user[data] : user;
});
