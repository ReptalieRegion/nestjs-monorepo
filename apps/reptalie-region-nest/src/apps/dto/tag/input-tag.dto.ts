import { IsString, IsEnum } from 'class-validator';

export enum TagType {
    Comment = 'comment',
    CommentReply = 'commentReply',
    Share = 'share',
}

export class InputTagDTO {
    @IsEnum(TagType)
    readonly type: TagType;

    @IsString()
    readonly typeId: string;

    @IsString()
    readonly tagIds: string[];
}
