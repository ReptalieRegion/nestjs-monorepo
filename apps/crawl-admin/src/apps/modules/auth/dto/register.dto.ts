import { IsString } from 'class-validator';

export class RegisterDTO {
    @IsString()
    readonly email: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly password: string;
}
