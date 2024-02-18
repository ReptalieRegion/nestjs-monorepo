import { SocialProviderType } from '@private-crawl/types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export interface IRestoreRequestDTO {
    readonly provider: string;
    readonly encryptedData: string;
}

export class InputTempUserDTO {
    @IsString()
    readonly userId: string;

    @IsString()
    readonly imageId: string;

    @IsEnum(SocialProviderType)
    readonly provider: SocialProviderType;

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
