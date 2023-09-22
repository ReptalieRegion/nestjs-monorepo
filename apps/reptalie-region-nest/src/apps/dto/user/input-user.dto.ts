import { IsOptional, IsString } from 'class-validator';

export class InputUserDTO {
    @IsString()
    readonly userId: string;

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
    readonly recommender?: string;
}
