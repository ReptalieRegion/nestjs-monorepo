import { IsString } from 'class-validator';

export class DeviceInfoDTO {
    @IsString()
    readonly version: string;

    @IsString()
    readonly buildNumber: string;

    @IsString()
    readonly systemName: string;

    @IsString()
    readonly systemVersion: string;
}
