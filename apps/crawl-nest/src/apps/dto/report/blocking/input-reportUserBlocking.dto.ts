import { IsString } from 'class-validator';

export class InputReportUserBlockingDTO {
    @IsString()
    readonly blocker: string;

    @IsString()
    readonly blocked: string;
}
