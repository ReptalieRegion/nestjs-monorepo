import { pbkdf2Sync, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';

interface IEncryptedData {
    salt: string;
    encryptedData: string;
}

export const PBKDF2ServiceToken = 'PBKDF2ServiceToken';

@Injectable()
export class PBKDF2Service {
    encryptPBKDF2(plaintext: string): IEncryptedData | undefined {
        const salt = randomBytes(16).toString('base64');
        const { INTERATIONS, DKLEN, HASH } = process.env;
        
        if (INTERATIONS === undefined || DKLEN === undefined || HASH === undefined) {
            return undefined;
        }

        const encryptedData = pbkdf2Sync(plaintext, salt, Number(INTERATIONS), Number(DKLEN), HASH).toString('base64');

        return { salt, encryptedData };
    }

    comparePBKDF2(password: string, salt: string, hashedPassword: string): boolean {
        const { INTERATIONS, DKLEN, HASH } = process.env;

        if (
            INTERATIONS === undefined ||
            DKLEN === undefined ||
            HASH === undefined ||
            password === undefined ||
            salt === undefined ||
            hashedPassword === undefined
        ) {
            return false;
        }
        const hashedInputPassword = pbkdf2Sync(password, salt, Number(INTERATIONS), Number(DKLEN), HASH).toString('base64');
        return hashedPassword === hashedInputPassword;
    }
}
