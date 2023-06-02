import { PXR1_100, colors, maxHeights, keyframes, animations, fontSize } from './utils';
import scrollbarHide from './plugins/scrollbar-hide';

export const theme = {
    extend: {
        fontSize: {
            ...fontSize,
        },
        keyframes: {
            ...keyframes,
        },
        animation: {
            ...animations,
        },
        colors: {
            ...colors,
        },
        maxHeight: {
            ...maxHeights,
        },
    },
    spacing: {
        ...PXR1_100,
    },
};
export const plugins = [scrollbarHide];
