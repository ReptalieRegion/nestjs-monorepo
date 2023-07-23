'use client';

import { createContext, useEffect, PropsWithChildren, useContext } from 'react';

import WebviewBridgeManager from '@/utils/webview-bridge/utils/WebviewBridgeManager';
import {
    IAsyncStorage,
    IHaptic,
    INavigation,
    deserializeNextJS,
    isNextModule,
    isRNModule,
} from '@reptalieregion/webview-bridge';
import { Haptic, Navigation, AsyncStorage } from '@/utils/webview-bridge/react-native';

import { RouterContext } from '../router/RouterContext';

type TWebviewBridgeValue = {
    Haptic?: IHaptic;
    Navigation?: INavigation;
    AsyncStorage?: IAsyncStorage;
};

export const WebviewBridgeContext = createContext<TWebviewBridgeValue>({});

const webviewBridgeManager = new WebviewBridgeManager();

const WebviewBridgeComponent = ({ children }: PropsWithChildren) => {
    const router = useContext(RouterContext);

    useEffect(() => {
        const makeReturnValue = (event: MessageEvent<any>) => {
            try {
                if (typeof event.data !== 'string') {
                    return;
                }

                const deserialized = deserializeNextJS(event.data);
                if (!deserialized) {
                    return;
                }

                const { type, message } = deserialized;
                if (type === 'call' && isNextModule(message.module)) {
                    if (message.module === 'NextJSNavigation') {
                        if (message.command === 'push') {
                            const { href, options } = message.payload;
                            router.push(href, options);
                        }
                        if (message.command === 'replace') {
                            const { href } = message.payload;
                            router.replace(href);
                        }
                    }
                    return;
                }

                if (type === 'return' && isRNModule(message.module)) {
                    webviewBridgeManager.notifyObservers(message);
                }
            } catch (error) {
                console.error(error);
            }
        };
        window.addEventListener('message', makeReturnValue, true);
        return () => {
            window.removeEventListener('message', makeReturnValue);
        };
    }, [router]);

    const webviewBridge = {
        Haptic: Haptic(webviewBridgeManager),
        Navigation: Navigation(webviewBridgeManager),
        AsyncStorage: AsyncStorage(webviewBridgeManager),
    };

    return <WebviewBridgeContext.Provider value={webviewBridge}>{children}</WebviewBridgeContext.Provider>;
};

export default WebviewBridgeComponent;
