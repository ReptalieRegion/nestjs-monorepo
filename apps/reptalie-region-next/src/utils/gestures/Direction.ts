// -1: 판단 거리 미달, 0: 상, 1: 하, 2: 좌, 3: 우
export type TMoveType = -1 | 0 | 1 | 2 | 3;

type TDirecionInfo = Pick<IDirectionInfo, 'width' | 'height'> & Partial<Pick<IDirectionInfo, 'minDistance'>>;

interface IDirectionInfo {
    lock: boolean;
    width: number;
    height: number;
    moveType: TMoveType;
    startEvent: boolean;
    startX: number;
    startY: number;
    startTime: number;
    minDistance: number;
}

interface ICalculateDirection {
    x: number;
    y: number;
}

const defaultDirectionInfo: IDirectionInfo = {
    lock: false,
    width: 360,
    height: 600,
    moveType: -1,
    startX: -1,
    startY: -1,
    startTime: 0,
    startEvent: false,
    minDistance: 10,
};

const customDirection = () => {
    return (directionInfo: TDirecionInfo) => {
        const mergeDirectionInfo = { ...defaultDirectionInfo, directionInfo };
        const { height, width } = mergeDirectionInfo;
        const baseSlope = parseFloat((height / 2 / width).toFixed(2));

        const start = (event: TouchEvent) => {
            const changedTouche = event.changedTouches[0];
            mergeDirectionInfo.startX = changedTouche.pageX;
            mergeDirectionInfo.startY = changedTouche.pageY;
            mergeDirectionInfo.startTime = event.timeStamp;
            mergeDirectionInfo.startEvent = true;
        };

        const move = (event: TouchEvent) => {
            if (!mergeDirectionInfo.startEvent) {
                return;
            }

            const changedTouche = event.changedTouches[0];

            const x = changedTouche.pageX;
            const y = changedTouche.pageY;
            mergeDirectionInfo.moveType = calculateDirection({ x, y });
        };

        const end = () => {
            mergeDirectionInfo.startEvent = false;
            mergeDirectionInfo.moveType = -1;
            mergeDirectionInfo.lock = false;
        };

        const getMoveType = () => {
            return mergeDirectionInfo.moveType;
        };

        const calculateDirection = ({ x, y }: ICalculateDirection): TMoveType => {
            const { startX, startY, minDistance, lock, moveType } = mergeDirectionInfo;
            if (lock) {
                return moveType;
            }

            const moveX = Math.abs(startX - x);
            const moveY = Math.abs(startY - y);
            const distance = moveX + moveY;

            if (distance < minDistance) {
                return -1;
            }

            mergeDirectionInfo.lock = true;

            const slope = parseFloat((moveY / moveX).toFixed(2));
            if (slope > baseSlope) {
                return y < startY ? 0 : 1;
            }

            return x < startX ? 2 : 3;
        };

        return {
            start,
            move,
            end,
            getMoveType,
        };
    };
};

export default customDirection;
