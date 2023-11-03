import * as crypto from 'crypto';
import * as fs from 'fs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

export const CryptoServiceToken = 'CryptoServiceToken';

@Injectable()
export class CryptoService {
    private privateKeyPath = 'key/private_key.pem';
    private publicKeyPath = 'key/public_key.pem';

    constructor() {
        this.initializeKeys();
    }

    getPublicKey(): string {
        const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
        return publicKey;
    }

    encrypt(data: string): string {
        const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
        const buffer = Buffer.from(data, 'utf8');
        const encryptedData = crypto.publicEncrypt(publicKey, buffer).toString('base64');
        return encryptedData;
    }

    decrypt(encryptedData: string): string {
        try {
            const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
            const buffer = Buffer.from(encryptedData, 'base64');
            const decryptedData = crypto.privateDecrypt(
                {
                    key: privateKey,
                    passphrase: process.env.CRYPTO_SECRET_KEY,
                },
                buffer,
            );

            return decryptedData.toString('utf8');
        } catch (error) {
            const caughtError = error as Error;
            if (caughtError.message.includes('decoding error')) {
                throw new InternalServerErrorException('RSA OAEP decoding error occurred.');
            }

            throw caughtError;
        }
    }

    private initializeKeys() {
        if (fs.existsSync(this.privateKeyPath) && fs.existsSync(this.publicKeyPath)) {
            return;
        }

        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },

            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: process.env.CRYPTO_SECRET_KEY,
            },
        });

        fs.writeFileSync(this.privateKeyPath, privateKey);
        fs.writeFileSync(this.publicKeyPath, publicKey);
    }
}
