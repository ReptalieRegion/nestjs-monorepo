import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '@private-crawl/models';
import { Request } from 'express';

export const AuthUser = createParamDecorator((data: keyof UserDocument, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest<Request>().user as UserDocument;

    return data ? user && user[data] : user;
});
