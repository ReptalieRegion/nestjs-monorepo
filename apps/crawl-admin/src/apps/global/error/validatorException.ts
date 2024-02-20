import { HttpStatus } from '@nestjs/common';
import { CustomException } from './customException';

export class ValidatorException extends CustomException {
    constructor(message: string | string[], code: number) {
        super(message, HttpStatus.UNPROCESSABLE_ENTITY, code);
    }
}
