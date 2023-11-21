import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';
import { FirebaseMessagingService, FirebaseMessagingServiceToken } from './service/firebase-messaging.service';

const createUseFactory = (configService: ConfigService, Service: typeof FirebaseMessagingService) => {
    const privateKey = configService.get<string>('PRIVATE_KEY') ?? '';
    const app =
        admin.apps.length === 0
            ? admin.initializeApp({
                  credential: admin.credential.cert({
                      projectId: configService.get<string>('PROJECT_ID'),
                      privateKey: privateKey[0] === '-' ? privateKey : JSON.parse(privateKey),
                      clientEmail: configService.get<string>('CLIENT_EMAIL'),
                  }),
              })
            : admin.apps[0];

    if (app === null) {
        throw new Error('[Firebase] no init');
    }

    return new Service(app);
};

export const FirebaseMessagingServiceProvider: Provider = {
    provide: FirebaseMessagingServiceToken,
    inject: [ConfigService],
    useFactory: (configService) => createUseFactory(configService, FirebaseMessagingService),
};
