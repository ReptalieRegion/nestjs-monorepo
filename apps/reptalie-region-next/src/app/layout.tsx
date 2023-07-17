import { Inter } from 'next/font/google';
import ReactQueryProviders from '../contexts/react-query/providers';
import { IReactNode } from '<React>';
import './globals.css';
import RouterComponentContext from '@/contexts/router/RouterContext';
import WebviewBridgeComponent from '@/contexts/webview-bridge/WebviewBridgeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
    viewport: {
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
};

export default function RootLayout({ children }: IReactNode) {
    return (
        <html lang="en">
            <body className={`${inter.className} overflow-hidden`}>
                <RouterComponentContext>
                    <WebviewBridgeComponent>
                        <main className="absolute w-full h-full ">
                            <ReactQueryProviders>{children}</ReactQueryProviders>
                            <div id="modal" />
                            <div id="bottomSheet" />
                            <div id="toast" />
                            <div id="alert" />
                        </main>
                    </WebviewBridgeComponent>
                </RouterComponentContext>
            </body>
        </html>
    );
}
