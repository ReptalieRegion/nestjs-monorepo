import { pbkdf2Sync, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';

interface IEncryptPassword {
    salt: string;
    hashedPassword: string;
}

@Injectable()
export class PBKDF2Service {
    encryptPBKDF2(password: string): IEncryptPassword | undefined {
        const salt = randomBytes(16).toString('base64');
        const { INTERATIONS, DKLEN, HASH } = process.env;
        console.log(salt, INTERATIONS, DKLEN, HASH);
        if (INTERATIONS === undefined || DKLEN === undefined || HASH === undefined) {
            return undefined;
        }

        const hashedPassword = pbkdf2Sync(password, salt, Number(INTERATIONS), Number(DKLEN), HASH).toString('base64');

        return { salt, hashedPassword };
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
