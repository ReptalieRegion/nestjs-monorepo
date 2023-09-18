import { IsOptional, IsString } from 'class-validator';

export class InputFollowDTO {
    @IsString()
    readonly following: string | undefined;

    @IsString()
    readonly follower: string | undefined;

    @IsOptional()
    @IsString()
    readonly followerNickname: string | undefined;
}
