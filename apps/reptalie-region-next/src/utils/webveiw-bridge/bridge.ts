'use client';

import { Haptic } from './Haptic';
import { Navigate } from './Navigate';
import { AsyncStorage } from './AsyncStorage';
import ConcreteSubject from '../observer/Observer';

const WebviewBridge = (subject: ConcreteSubject) => {
    return {
        Haptic,
        Navigate,
        AsyncStorage: AsyncStorage(subject),
    };
};

export default WebviewBridge;
