import { IsBoolean, IsString } from 'class-validator';

export interface IAgreeStatus {
    isAgree: boolean;
}

export class InputNotificationAgreeDTO {
    @IsString()
    readonly userId: string;

    @IsBoolean()
    readonly comment: boolean;

    @IsBoolean()
    readonly like: boolean;

    @IsBoolean()
    readonly post: boolean;

    @IsBoolean()
    readonly follow: boolean;

    @IsBoolean()
    readonly service: boolean;
}
