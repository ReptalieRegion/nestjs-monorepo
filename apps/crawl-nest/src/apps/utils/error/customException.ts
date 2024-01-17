import { HttpException } from '@nestjs/common';

interface ICustomException {
    errorCode: number;
    timestamp: string;
    statusCode: number;
    path: string;
}

export class CustomException extends HttpException implements ICustomException {
    errorCode: number;
    timestamp: string;
    statusCode: number;
    path: string;

    constructor(response: string | string[], statusCode: number, code: number) {
        super(response, statusCode);
        this.errorCode = code;
        this.statusCode = statusCode;
    }
}
