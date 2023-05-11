import { IsEmail, IsOptional, IsString } from 'class-validator';

export class InputUserDTO {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly nickname: string;

    @IsString()
    readonly phone: string;

    @IsString()
    @IsOptional()
    readonly address?: string;

    @IsString()
    @IsOptional()
    readonly profileImage?: string;

    @IsString()
    @IsOptional()
    readonly point?: string;

    @IsString()
    @IsOptional()
    readonly recommender?: string;
}
