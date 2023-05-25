import { IGestures } from '<Gestures>';

class LongTouch implements IGestures {
    constructor(
        private isLongTab: boolean = false,
        private startEvent: boolean = false,
        private nLongTabTimer?: NodeJS.Timeout,
    ) {}

    onStart() {
        this.longTabTimer();
        this.startEvent = true;
    }

    onMove() {
        if (!this.startEvent) {
            return;
        }
    }

    onEnd() {
        if (!this.startEvent) {
            return;
        }

        this.deleteLongTabTimer();
        this.startEvent = false;
    }

    getIsLongTab() {
        return this.isLongTab;
    }

    private longTabTimer() {
        if (this.startEvent) {
            return;
        }

        this.isLongTab = false;
        this.nLongTabTimer = setTimeout(() => {
            this.isLongTab = true;
            this.nLongTabTimer = undefined;
        }, 200);
    }

    private deleteLongTabTimer() {
        if (typeof this.nLongTabTimer !== 'undefined') {
            clearTimeout(this.nLongTabTimer);
            this.nLongTabTimer = undefined;
        }
    }
}

export const newLongTouch = new LongTouch();
export default LongTouch;
