import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { BasicTemplate } from '../template/input-notificationTemplate.dto';

export class BasicContents extends BasicTemplate {
    @IsOptional()
    readonly image: string;
}

export class InputNotificationLogDTO {
    @IsOptional()
    @IsString()
    readonly userId: string;

    @IsString()
    readonly templateId: string;

    @IsString()
    readonly messageId: string;

    @ValidateNested()
    @Type(() => BasicContents)
    readonly contents: BasicContents;
}
