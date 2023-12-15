import { IsString, IsArray, IsEnum } from 'class-validator';

export enum ImageType {
    Share = 'share',
    Profile = 'profile',
    Diary = 'diary',
}

export class InputImageDTO {
    @IsArray()
    @IsString({ each: true })
    readonly imageKey?: string[];

    @IsEnum(ImageType)
    readonly type: ImageType;

    @IsString()
    readonly typeId: string;
}
