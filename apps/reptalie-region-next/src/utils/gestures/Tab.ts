interface ITabInfo {
    isTab: boolean;
    moveEvent: boolean;
    startEvent: boolean;
}

const defaultTabInfo: ITabInfo = {
    isTab: false,
    moveEvent: false,
    startEvent: false,
};

const customTab = () => {
    const tabInfo: ITabInfo = { ...defaultTabInfo };
    const start = () => {
        tabInfo.isTab = false;
        tabInfo.startEvent = true;
    };

    const move = () => {
        if (!tabInfo.startEvent) {
            return;
        }
        tabInfo.moveEvent = true;
    };

    const end = () => {
        const { startEvent, moveEvent } = tabInfo;
        if (!startEvent || moveEvent) {
            return;
        }

        tabInfo.isTab = true;
        tabInfo.startEvent = false;
    };

    const getIsTab = () => {
        return tabInfo.isTab;
    };

    return {
        start,
        move,
        end,
        getIsTab,
    };
};

export default customTab;
