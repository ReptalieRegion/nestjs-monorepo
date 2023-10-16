import { IsOptional, IsString } from 'class-validator';

export class InputFollowDTO {
    @IsString()
    readonly following: string;

    @IsString()
    readonly follower: string;

    @IsOptional()
    @IsString()
    readonly followerNickname: string;
}
