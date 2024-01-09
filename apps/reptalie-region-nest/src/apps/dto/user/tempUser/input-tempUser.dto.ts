import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SocialProvierType } from '../social/input-social.dto';

export interface IRestoreRequestDTO {
    readonly provider: SocialProvierType;
    readonly uniqueId: string;
}

export class InputTempUserDTO {
    @IsString()
    readonly userId: string;

    @IsString()
    readonly imageId: string;

    @IsEnum(SocialProvierType)
    readonly provider: SocialProvierType;

    @IsString()
    readonly uniqueId: string;

    @IsString()
    readonly nickname: string;

    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsString()
    readonly phone?: string;

    @IsOptional()
    @IsString()
    readonly address?: string;
}
