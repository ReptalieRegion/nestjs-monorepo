import { IsString, IsArray, IsEnum } from 'class-validator';

export enum ImageType {
    Share = 'share',
    Profile = 'profile',
    Information = 'information',
}

export class InputImageDTO {
    @IsArray()
    @IsString({ each: true })
    readonly imageKeys?: string[];

    @IsEnum(ImageType)
    readonly type: ImageType;

    @IsString()
    readonly typeId: string;
}
