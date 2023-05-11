import { IsString } from 'class-validator';
import { InputUserDTO } from './input-user.dto';

export class CreateUserDTO extends InputUserDTO {
    @IsString()
    readonly salt: string;
}
