import { IsOptional, IsString } from 'class-validator';

export class InputUserDTO {
    @IsString()
    @IsOptional()
    readonly name?: string;

    @IsString()
    readonly nickname: string;

    @IsString()
    @IsOptional()
    readonly phone?: string;

    @IsString()
    @IsOptional()
    readonly address?: string;

    @IsString()
    @IsOptional()
    readonly fcmToken?: string;

    @IsString()
    @IsOptional()
    readonly imageId: string;
}
