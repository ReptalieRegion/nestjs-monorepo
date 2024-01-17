import { IsBoolean, IsString } from 'class-validator';

export interface IAgreeStatusDTO {
    isAgree: boolean;
}

export class InputNotificationAgreeDTO {
    @IsString()
    readonly userId: string;

    @IsBoolean()
    readonly device: boolean;

    @IsBoolean()
    readonly comment: boolean;

    @IsBoolean()
    readonly like: boolean;

    @IsBoolean()
    readonly follow: boolean;

    @IsBoolean()
    readonly tag: boolean;

    @IsBoolean()
    readonly service: boolean;
}
