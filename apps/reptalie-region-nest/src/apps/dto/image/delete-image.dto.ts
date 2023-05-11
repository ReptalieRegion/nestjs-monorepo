import { IsString } from 'class-validator';

export class DeleteImageDTO {
    @IsString()
    key: string;
}
