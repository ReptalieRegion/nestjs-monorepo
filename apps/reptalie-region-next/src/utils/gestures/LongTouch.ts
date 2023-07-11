interface ILongTouchInfo {
    isLongTouch: boolean;
    startEvent: boolean;
    longTouchTimer?: NodeJS.Timeout;
}

const touchInfo: ILongTouchInfo = {
    isLongTouch: false,
    startEvent: false,
    longTouchTimer: undefined,
};

const customLongTouch = (delay = 300) => {
    const start = () => {
        if (touchInfo.startEvent) {
            return;
        }

        startLongTouchTimer();
        touchInfo.startEvent = true;
    };

    const end = () => {
        const { startEvent, longTouchTimer } = touchInfo;
        const isStartTouch = startEvent && longTouchTimer !== undefined;
        if (!isStartTouch) {
            return;
        }

        clearTimeout(longTouchTimer);
        touchInfo.longTouchTimer = undefined;
        touchInfo.startEvent = false;
    };

    const getIsLongTouch = () => {
        return touchInfo.isLongTouch;
    };

    const startLongTouchTimer = () => {
        touchInfo.isLongTouch = false;
        touchInfo.longTouchTimer = setTimeout(() => {
            touchInfo.isLongTouch = true;
            touchInfo.longTouchTimer = undefined;
            touchInfo.startEvent = false;
        }, delay);
    };
    return {
        start,
        end,
        getIsLongTouch,
    };
};

export default customLongTouch;
