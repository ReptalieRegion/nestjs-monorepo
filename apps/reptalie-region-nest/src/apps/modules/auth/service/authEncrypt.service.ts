import * as crypto from 'crypto';
import { pbkdf2Sync, randomBytes } from 'crypto';
import * as fs from 'fs';
import path from 'path';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

interface IPBKDF2EncryptedData {
    salt: string;
    encryptedData: string;
}

export const AuthEncryptServiceToken = 'AuthEncryptServiceToken';

@Injectable()
export class AuthEncryptService {
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

    /**
     * 공개 키를 반환합니다.
     *
     * @returns 공개 키 문자열을 반환합니다.
     */
    getPublicKey(): string {
        const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');

        return publicKey;
    }

    /**
     * 주어진 평문을 공개 키를 사용하여 암호화합니다.
     *
     * @param plaintext - 암호화할 평문
     * @returns 암호화된 데이터를 반환합니다.
     */
    encryptCrypto(plaintext: string): string {
        const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
        const buffer = Buffer.from(plaintext, 'utf8');
        const encryptedData = crypto.publicEncrypt(publicKey, buffer).toString('base64');

        return encryptedData;
    }

    /**
     * 암호화된 데이터를 개인 키를 사용하여 복호화합니다.
     *
     * @param encryptedData - 암호화된 데이터
     * @returns 복호화된 평문을 반환합니다.
     */
    decryptCrypto(encryptedData: string): string {
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

    /**
     * 주어진 평문을 PBKDF2 알고리즘을 사용하여 암호화합니다.
     *
     * @param plaintext - 암호화할 평문
     * @returns salt와 암호화된 데이터 객체를 반환합니다.
     */
    encryptPBKDF2(plaintext: string): IPBKDF2EncryptedData | undefined {
        const salt = randomBytes(16).toString('base64');
        const { INTERATIONS, DKLEN, HASH } = process.env;

        if (INTERATIONS === undefined || DKLEN === undefined || HASH === undefined) {
            return undefined;
        }

        const encryptedData = pbkdf2Sync(plaintext, salt, Number(INTERATIONS), Number(DKLEN), HASH).toString('base64');

        return { salt, encryptedData };
    }

    /**
     * 주어진 평문, salt 키 및 암호화된 데이터를 사용하여 암호화된 데이터를 검증합니다.
     * 
     * @param plaintext - 검증할 평문
     * @param salt - 암호화할때 사용된 salt 키
     * @param encryptedData - 암호화된 데이터
     * @returns 검증 결과 (true: 일치, false: 불일치)를 반환합니다.
     */
    comparePBKDF2(plaintext: string, salt: string, encryptedData: string): boolean {
        const { INTERATIONS, DKLEN, HASH } = process.env;

        if (
            INTERATIONS === undefined ||
            DKLEN === undefined ||
            HASH === undefined ||
            plaintext === undefined ||
            salt === undefined ||
            encryptedData === undefined
        ) {
            return false;
        }
        const hashedPlaintext = pbkdf2Sync(plaintext, salt, Number(INTERATIONS), Number(DKLEN), HASH).toString('base64');
        return encryptedData === hashedPlaintext;
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
