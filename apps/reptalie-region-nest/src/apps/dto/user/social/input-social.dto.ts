import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum ProviderType {
    Kakao = 'kakao',
    Google = 'google',
    Apple = 'apple',
}

export enum JoinProgressType {
    DONE = 'done',
    REGISTER0 = 'resister0',
}

export class InputSocialDTO {
    @IsString()
    userId: string;

    @IsEnum(ProviderType)
    provider: ProviderType;

    @IsString()
    uniqueId: string;

    @IsEnum(JoinProgressType)
    joinProgress: JoinProgressType;

    @IsString()
    @IsOptional()
    salt?: string;

    @IsString()
    @IsOptional()
    refreshToken?: string;
}
