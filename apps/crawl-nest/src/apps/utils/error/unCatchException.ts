import { HttpStatus } from '@nestjs/common';
import { CustomException } from './customException';

export class UnCatchException extends CustomException {
    constructor() {
        super('Unknown error.', HttpStatus.INTERNAL_SERVER_ERROR, -99999);
    }
}