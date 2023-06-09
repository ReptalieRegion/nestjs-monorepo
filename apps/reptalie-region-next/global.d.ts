/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
    import { FC, SVGProps } from 'react';
    const content: FC<SVGProps<SVGAElement>>;
    export const ReactComponent: FC<SVGProps<SVGAElement>>;
    export default content;
}

declare global {
    interface Window {
        ReactNativeWebView: {
            postMessage: (data: string) => void;
        };
    }
}

export {};
