import { Module } from '@nestjs/common';
import { FirebaseMessagingServiceProvider } from './firebase.providers';

@Module({
    providers: [FirebaseMessagingServiceProvider],
    exports: [FirebaseMessagingServiceProvider],
})
export class FirebaseModule {}
