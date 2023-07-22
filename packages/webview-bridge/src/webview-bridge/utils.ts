import { doPathsExist } from '../common/utils';
import { NEXT_JS_MODULES, NextJSPostMessageType, NextJSPostReturnType } from './rn-requests-webview/types';
import { RN_MODULES, RNPostMessageType, RNPostReturnType } from './webview-requests-rn';

class SerializationError extends Error {
    constructor(message: string) {
        super(`[Serialization Error] ${message}`);
        this.name = 'SerializationError';
    }
}

type MessageOrigin = 'RN' | 'NextJS';
type MessageType = 'call' | 'return';

type MessageTypeInfo = {
    from: MessageOrigin;
    type: MessageType;
};

type SerializedMessage = NextJSPostMessageType | NextJSPostReturnType | RNPostMessageType | RNPostReturnType;

const serialize = (messageTypeInfo: MessageTypeInfo, message: SerializedMessage) => {
    try {
        const result = JSON.stringify({ messageTypeInfo, message });
        return result;
    } catch (error) {
        throw new SerializationError(JSON.stringify(error));
    }
};

export const serializeRNCall = (message: NextJSPostMessageType) => serialize({ from: 'RN', type: 'call' }, message);
export const serializeRNReturn = (message: RNPostReturnType) => serialize({ from: 'RN', type: 'return' }, message);
export const serializeNextJSCall = (message: RNPostMessageType) => serialize({ from: 'NextJS', type: 'call' }, message);
export const serializeNextJSReturn = (message: NextJSPostReturnType) => serialize({ from: 'NextJS', type: 'return' }, message);

class DeserializationError extends Error {
    constructor(message: string) {
        super(`[Deserialization Error] ${message}`);
        this.name = 'DeserializationError';
    }
}

type DeserializationInfo = {
    from: MessageOrigin;
    messageStr: string;
};

type DeserializationReturn<Type extends MessageType, ReturnType> = {
    type: Type;
    message: ReturnType;
};

export const deserialize = <CallMessage, ReturnMessage>(
    info: DeserializationInfo,
): DeserializationReturn<'call', CallMessage> | DeserializationReturn<'return', ReturnMessage> => {
    try {
        const parsedMessage = JSON.parse(info.messageStr);
        if (!parsedMessage) {
            throw new DeserializationError('Parsed message not found');
        }

        const isSafelyMessage = doPathsExist(parsedMessage, [
            'messageTypeInfo.from',
            'messageTypeInfo.type',
            'message.module',
            'message.command',
        ]);
        if (isSafelyMessage) {
            throw new DeserializationError('Message type info or message not found');
        }

        const {
            messageTypeInfo: { from, type },
            message,
        } = parsedMessage;

        if (from === info.from && type === 'call') {
            return { type: 'call', message: message as CallMessage };
        }

        if (from === info.from && type === 'return') {
            return { type: 'return', message: message as ReturnMessage };
        }

        throw new DeserializationError('From or type not match');
    } catch (error) {
        if (error instanceof DeserializationError) {
            throw error;
        }
        throw new DeserializationError(JSON.stringify(error));
    }
};

export const deserializeRN = (messageStr: string) =>
    deserialize<RNPostMessageType, NextJSPostReturnType>({ from: 'RN', messageStr });

export const deserializeNextJS = (messageStr: string) =>
    deserialize<NextJSPostMessageType, RNPostReturnType>({ from: 'NextJS', messageStr });

export const isNextModule = (module: string) => NEXT_JS_MODULES.indexOf(module) !== -1;

export const isRNModule = (module: string) => RN_MODULES.indexOf(module) !== -1;
