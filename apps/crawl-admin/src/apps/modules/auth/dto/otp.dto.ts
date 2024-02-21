import { IsString } from 'class-validator';

export class OtpDTO {
    @IsString()
    readonly email: string;

    @IsString()
    readonly otpCode: string;
}
