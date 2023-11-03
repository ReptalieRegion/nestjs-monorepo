import { IsString } from 'class-validator';

export class EncryptedDataDTO {
    @IsString()
    encryptedData: string;
}
