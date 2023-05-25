import { IGestures } from '<Gestures>';

class Tab implements IGestures {
    constructor(private startEvent: boolean = false, private moveEvent: boolean = false, private isTab: boolean = false) {}

    onStart() {
        this.isTab = false;
        this.startEvent = true;
    }

    onMove() {
        if (!this.startEvent) {
            return;
        }

        setTimeout;

        this.moveEvent = true;
    }

    onEnd() {
        if (this.startEvent && !this.moveEvent) {
            this.isTab = true;
        }

        this.startEvent = false;
        this.moveEvent = false;
    }

    getIsTab() {
        return this.isTab;
    }
}

export default Tab;
