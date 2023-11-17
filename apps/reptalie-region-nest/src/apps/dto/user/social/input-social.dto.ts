import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum SocialProvierType {
    Kakao = 'kakao',
    Google = 'google',
    Apple = 'apple',
}

export enum JoinProgressType {
    DONE = 'DONE',
    REGISTER0 = 'REGISTER0',
}

export interface IEncryptedData {
    encryptedData: string;
}

export interface IJoinProgress {
    userId: string;
    joinProgress: JoinProgressType;
    nickname: string;
}

export class InputSocialDTO {
    @IsString()
    userId: string;

    @IsEnum(SocialProvierType)
    provider: SocialProvierType;

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
