import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomException } from '../customException';
import { UnCatchException } from '../unCatchException';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const res = exception instanceof CustomException ? exception : new UnCatchException();
        console.log(exception);

        response.status(res.statusCode).json({
            statusCode: res.statusCode,
            msg: res.getResponse(),
            code: res.errorCode,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
