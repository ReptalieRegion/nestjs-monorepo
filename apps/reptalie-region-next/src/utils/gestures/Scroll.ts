interface IScrollProps<T> {
    element: T;
}

interface IScrollInfo {
    startX: number;
    startY: number;
    startScrollTop: number;
    startScrollLeft: number;
}

const defaultScrollInfo: IScrollInfo = {
    startX: 0,
    startY: 0,
    startScrollTop: 0,
    startScrollLeft: 0,
};

export const scrollToLeftSmooth = <T extends HTMLElement>(element: T, left: number) => {
    element.scrollTo({ left, behavior: 'smooth' });
};

const customScroll = <T extends HTMLElement>({ element }: IScrollProps<T>) => {
    return (scrollInfo?: IScrollInfo) => {
        const mergeScrollInfo = { ...defaultScrollInfo, ...scrollInfo };

        const start = (event: TouchEvent) => {
            const touch = event.touches[0];
            mergeScrollInfo.startX = touch.pageX - element.getBoundingClientRect().left;
            mergeScrollInfo.startY = touch.pageY - element.getBoundingClientRect().top;
            mergeScrollInfo.startScrollLeft = element.scrollLeft;
            mergeScrollInfo.startScrollTop = element.scrollTop;
        };

        const move = (event: TouchEvent) => {
            moveHorizontality(event);
            movePerpendicular(event);
        };

        const moveHorizontality = (event: TouchEvent) => {
            const currentX = event.touches[0].pageX - element.getBoundingClientRect().left;
            const moveX = currentX - mergeScrollInfo.startX;
            element.scrollLeft = mergeScrollInfo.startScrollLeft - moveX;
        };

        const movePerpendicular = (event: TouchEvent) => {
            const currentY = event.touches[0].pageY - element.getBoundingClientRect().top;
            const moveY = currentY - mergeScrollInfo.startY;
            element.scrollTop = mergeScrollInfo.startScrollTop - moveY;
        };

        return {
            start,
            move,
            moveHorizontality,
            movePerpendicular,
            scrollToLeftSmooth: (left: number) => scrollToLeftSmooth<T>(element, left),
        };
    };
};

export default customScroll;
