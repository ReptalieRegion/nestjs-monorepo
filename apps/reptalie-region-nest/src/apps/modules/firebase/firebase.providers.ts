import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';
import { FirebaseMessagingService, FirebaseMessagingServiceToken } from './service/firebase-messaging.service';

const createUseFactory = (configService: ConfigService) => {
    const app =
        admin.apps.length === 0
            ? admin.initializeApp({
                  credential: admin.credential.cert({
                      projectId: configService.get<string>('PROJECT_ID'),
                      privateKey: configService.get<string>('PRIVATE_KEY'),
                      clientEmail: configService.get<string>('CLIENT_EMAIL'),
                  }),
              })
            : admin.apps[0];
    if (app === null) {
        throw new Error('[Firebase] no init');
    }
    return new FirebaseMessagingService(app);
};

export const FirebaseMessagingServiceProvider: Provider = {
    provide: FirebaseMessagingServiceToken,
    inject: [ConfigService],
    useFactory: createUseFactory,
};
