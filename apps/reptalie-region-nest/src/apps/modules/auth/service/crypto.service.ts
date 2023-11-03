import * as crypto from 'crypto';
import * as fs from 'fs';
import path from 'path';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

export const CryptoServiceToken = 'CryptoServiceToken';

@Injectable()
export class CryptoService {
    private keyRoot: string;
    private privateKeyPath: string;
    private publicKeyPath: string;

    constructor() {
        const keyRoot = path.join(__dirname, '../../../key');
        this.keyRoot = keyRoot;
        this.privateKeyPath = path.join(keyRoot, 'private_key.pem');
        this.publicKeyPath = path.join(keyRoot, 'public_key.pem');
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

        fs.mkdir(this.keyRoot, (error) => {
            if (error) {
                console.log(error);
            } else {
                fs.writeFileSync(this.privateKeyPath, privateKey);
                fs.writeFileSync(this.publicKeyPath, publicKey);
            }
        });
    }
}
