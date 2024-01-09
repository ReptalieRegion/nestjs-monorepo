import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SocialProvierType {
    Kakao = 'kakao',
    Google = 'google',
    Apple = 'apple',
}

export enum JoinProgressType {
    DONE = 'DONE',
    REGISTER0 = 'REGISTER0',
}

export interface IEncryptedDataDTO {
    encryptedData: string;
}

export class IJoinProgressDTO {
    @IsString()
    userId: string;

    @IsEnum(JoinProgressType)
    joinProgress: JoinProgressType;

    @IsString()
    nickname: string;
}

export class InputSocialDTO {
    @IsString()
    readonly userId: string;

    @IsEnum(SocialProvierType)
    readonly provider: SocialProvierType;

    @IsString()
    readonly uniqueId: string;

    @IsEnum(JoinProgressType)
    readonly joinProgress: JoinProgressType;

    @IsString()
    @IsOptional()
    readonly salt?: string;

    @IsString()
    @IsOptional()
    readonly refreshToken?: string;
}
