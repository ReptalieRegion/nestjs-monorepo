import crypto from 'crypto';
import { Injectable } from '@nestjs/common';

export const CryptoServiceToken = 'CryptoServiceToken';

@Injectable()
export class CryptoService {
    generateSalt(): string {
        return crypto.randomBytes(16).toString('hex');
    }

    async hashPassword(password: string, salt: string, iterations: number, keylen: number, digest: string): Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
                if (err) {
                    reject('Failed Hash Password');
                } else {
                    resolve(derivedKey.toString('hex'));
                }
            });
        });
    }

    async verifyPassword(
        password: string,
        hashedPassword: string,
        salt: string,
        iterations: number,
        keylen: number,
        digest: string,
    ): Promise<boolean> {
        const hash = await this.hashPassword(password, salt, iterations, keylen, digest);
        return hash === hashedPassword;
    }
}
