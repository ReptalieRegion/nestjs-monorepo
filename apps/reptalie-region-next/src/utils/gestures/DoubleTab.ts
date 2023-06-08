interface IDoubleTabInfo {
    isDoubleTab: boolean;
    moveEvent: boolean;
    startEvent: boolean;
    tabCount: number;
    x: number;
    y: number;
    time: number;
}

const defaultTabInfo: IDoubleTabInfo = {
    isDoubleTab: false,
    moveEvent: false,
    startEvent: false,
    tabCount: 0,
    x: -1,
    y: -1,
    time: 0,
};

const customDoubleTab = (duration = 400, tapThreshold = 5) => {
    const tabInfo: IDoubleTabInfo = { ...defaultTabInfo };
    const start = () => {
        tabInfo.startEvent = true;
    };

    const move = () => {
        if (!tabInfo.startEvent) {
            return;
        }

        tabInfo.moveEvent = true;
    };

    const end = (event: TouchEvent) => {
        const { startEvent, moveEvent, tabCount, time, x, y } = tabInfo;
        if (!startEvent || moveEvent) {
            return;
        }

        tabInfo.startEvent = false;
        tabInfo.moveEvent = false;

        const newX = event.changedTouches[0].pageX;
        const newY = event.changedTouches[0].pageY;

        const currentTime = event.timeStamp;
        if (tabCount === 1) {
            const isWithinTimeThreshold = currentTime - time <= duration;
            console.log(time, currentTime, currentTime - time);
            if (isWithinTimeThreshold) {
                const distanceX = Math.abs(x - newX);
                const distanceY = Math.abs(y - newY);
                const isWithinTapRadius = distanceX <= tapThreshold && distanceY <= tapThreshold;
                tabInfo.isDoubleTab = isWithinTapRadius;
            }

            tabInfo.tabCount = 0;
            tabInfo.y = -1;
            tabInfo.x = -1;
            tabInfo.time = 0;
            return;
        }

        tabInfo.tabCount += 1;
        tabInfo.x = newX;
        tabInfo.y = newY;
        tabInfo.time = currentTime;
        return;
    };

    const getIsDoubleTab = () => {
        return tabInfo.isDoubleTab;
    };

    return {
        start,
        move,
        end,
        getIsDoubleTab,
    };
};

export default customDoubleTab;
