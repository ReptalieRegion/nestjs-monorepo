import { HttpException, HttpStatus, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { BSONError } from 'bson';

export const controllerErrorHandler = (caughtError: unknown) => {
    if (caughtError instanceof HttpException) {
        throw caughtError;
    }

    const error = caughtError as Error;
    throw new HttpException(
        {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error.message,
            error: error.name,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
};

export const serviceErrorHandler = (caughtError: unknown, message: string) => {
    const error = caughtError as Error;
    if (error instanceof BSONError || error.name === 'CastError') {
        throw new UnprocessableEntityException(message);
    }

    if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        throw new InternalServerErrorException(message);
    }

    throw error;
};
