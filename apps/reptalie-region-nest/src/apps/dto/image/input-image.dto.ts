import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator';

export enum ImageType {
    Share = 'share',
    Profile = 'profile',
    Information = 'information',
}

export class InputImageDTO {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageKey?: string[];

    @IsEnum(ImageType)
    type: ImageType;

    @IsString()
    typeId: string;
}
