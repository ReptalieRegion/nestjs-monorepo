import customDoubleTab from '@/utils/gestures/DoubleTab';
import customTab from '@/utils/gestures/Tab';
import { HTMLAttributes, useEffect, useRef } from 'react';

interface IMoblieDivProps extends HTMLAttributes<HTMLDivElement> {
    onDoubleTab?: (event: TouchEvent) => void;
    onTab?: (event: TouchEvent) => void;
}

const MoblieDiv = ({ onDoubleTab, onTab, children, ...props }: IMoblieDivProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const doubleTabHandler = customDoubleTab();
    const tabHandler = customTab();

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        const doubleTabEndEvent = (event: TouchEvent) => {
            if (!onDoubleTab) {
                return;
            }

            doubleTabHandler.end(event);
            const isDoubleTab = doubleTabHandler.getIsDoubleTab();
            if (isDoubleTab) {
                onDoubleTab(event);
            }
        };

        const tabEndEvent = (event: TouchEvent) => {
            if (!onTab) {
                return;
            }

            tabHandler.end();
            const isTab = tabHandler.getIsTab();
            if (isTab) {
                onTab(event);
            }
        };

        element.addEventListener('touchstart', doubleTabHandler.start);
        element.addEventListener('touchmove', doubleTabHandler.move);
        element.addEventListener('touchend', doubleTabEndEvent);

        element.addEventListener('touchstart', tabHandler.start);
        element.addEventListener('touchmove', tabHandler.move);
        element.addEventListener('touchend', tabEndEvent);

        return () => {
            element.removeEventListener('touchstart', doubleTabHandler.start);
            element.removeEventListener('touchmove', doubleTabHandler.move);
            element.removeEventListener('touchend', doubleTabEndEvent);

            element.removeEventListener('touchstart', tabHandler.start);
            element.removeEventListener('touchmove', tabHandler.move);
            element.removeEventListener('touchend', tabEndEvent);
        };
    }, [doubleTabHandler, onDoubleTab, tabHandler, onTab]);

    return (
        <div ref={ref} {...props}>
            {children}
        </div>
    );
};

export default MoblieDiv;
