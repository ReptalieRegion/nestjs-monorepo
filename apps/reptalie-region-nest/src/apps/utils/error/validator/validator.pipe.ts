import { ArgumentMetadata, Injectable, PipeTransform, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidatorException } from '../validatorException';

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
    constructor(private code: number) {}

    async transform(value: unknown, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            const errorMessages = errors.flatMap((error) => Object.values(error.constraints ?? []));
            const message = errorMessages.length > 0 ? errorMessages : 'Unknown validation failure.';

            throw new ValidatorException(message, this.code);
        }

        return value;
    }

    private toValidate(metatype: Type<unknown> | undefined): boolean {
        const types: Array<Type<unknown> | undefined> = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
