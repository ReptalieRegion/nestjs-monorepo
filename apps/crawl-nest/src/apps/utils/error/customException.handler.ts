import { HttpStatus } from '@nestjs/common';
import { BSONError } from 'bson';
import { CustomException } from './customException';

export class CustomExceptionHandler {
    private readonly error: Error;

    constructor(caughtError: unknown) {
        this.error = caughtError as Error;
    }

    handleException(message: string, code: number) {
        if (this.isBSONError() || this.isCastError()) {
            throw new CustomException(message, HttpStatus.UNPROCESSABLE_ENTITY, code);
        }

        if (this.isDuplicateKeyError() || this.isDecryptCrypto() || this.isGoogleTokenId()) {
            throw new CustomException(message, HttpStatus.INTERNAL_SERVER_ERROR, code);
        }

        throw this.error;
    }

    private isBSONError(): boolean {
        return this.error instanceof BSONError;
    }

    private isCastError(): boolean {
        return this.error.name === 'CastError' || this.error.message.includes('Cast to ObjectId failed');
    }

    private isDuplicateKeyError(): boolean {
        return this.error.name === 'MongoServerError' && this.error.message.includes('E11000 duplicate key error');
    }

    private isDecryptCrypto(): boolean {
        const knownErrors = ['decoding error', 'data greater than mod len'];
        return knownErrors.some((knownError) => this.error.message.includes(knownError));
    }

    private isGoogleTokenId(): boolean {
        const knownErrors = [
            "Can't parse token envelope",
            'The verifyIdToken method requires an ID Token',
            'Invalid token signature',
        ];

        return knownErrors.some((knownError) => this.error.message.includes(knownError));
    }
}
