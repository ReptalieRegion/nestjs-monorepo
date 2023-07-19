import {
    PostMessageType,
    PostReturnType,
    TWebviewBridgeCommand,
    TWebviewBridgeModule,
    TWebviewBridgeSerializeMessage,
    TWebviewBridgeSerializeReturnMessage,
    WEBVIEW_BRIDGES,
} from './types';

const deserialize = <T>(messageStr: string): T | null => {
    try {
        const message = JSON.parse(messageStr);

        if (message && message?.module !== undefined && isWebviewBridgeModule(message.module)) {
            return message as T;
        }
    } catch {
        console.error('Error parsing message string:', messageStr);
    }

    return null;
};

export const isWebviewBridgeModule = (module: string) => {
    return WEBVIEW_BRIDGES.indexOf(module) !== -1;
};

export const deserializeMessage = (messageStr: string): PostMessageType | null => {
    return deserialize<PostMessageType>(messageStr);
};

export const deserializeReturnMessage = (messageStr: string): PostReturnType | null => {
    return deserialize<PostReturnType>(messageStr);
};

export const serializeReturnMessage = <Module extends TWebviewBridgeModule, Command extends TWebviewBridgeCommand<Module>>({
    module,
    command,
    payload,
}: TWebviewBridgeSerializeReturnMessage<Module, Command>) => {
    const message = { module, command, payload };

    return module && command && payload ? JSON.stringify(message) : undefined;
};

export const serializeMessage = <Module extends TWebviewBridgeModule, Command extends TWebviewBridgeCommand<Module>>({
    module,
    command,
    payload,
}: TWebviewBridgeSerializeMessage<Module, Command>) => {
    const message = { module, command, payload };

    return module && command && payload ? JSON.stringify(message) : undefined;
};
