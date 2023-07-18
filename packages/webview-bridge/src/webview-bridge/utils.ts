import { PostMessageType, PostReturnType, WEBVIEW_BRIDGES } from './types';

const deserialize = <T>(messageStr: string): T | null => {
    try {
        const message = JSON.parse(messageStr);

        if (message && message?.module && message.module === WEBVIEW_BRIDGES) {
            return message as T;
        }
    } catch {
        console.error('Error parsing message string:', messageStr);
    }

    return null;
};

export const deserializeMessage = (messageStr: string): PostMessageType | null => {
    return deserialize<PostMessageType>(messageStr);
};

export const deserializeReturnMessage = (messageStr: string): PostReturnType | null => {
    return deserialize<PostReturnType>(messageStr);
};

export const serializeReturnMessage = ({ module, command, data }: PostReturnType) => {
    const message = { module, command, data };

    return JSON.stringify(message);
};

export const serializeMessage = ({ module, command, data }: PostMessageType) => {
    const message = { module, command, data };

    return JSON.stringify(message);
};
