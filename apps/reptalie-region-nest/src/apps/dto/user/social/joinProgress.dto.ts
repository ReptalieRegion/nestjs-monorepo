import { IsEnum, IsString } from 'class-validator';
import { JoinProgressType } from './input-social.dto';

export class JoinProgressDTO {
    @IsString()
    userId: string;

    @IsEnum(JoinProgressType)
    joinProgress: JoinProgressType;

    @IsString()
    nickname: string;
}
