import { IsString } from 'class-validator';

export class fcmTokenDTO {
    @IsString()
    readonly fcmToken: string;
}
