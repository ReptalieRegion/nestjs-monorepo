import scrollbarHide from './plugins/scrollbar-hide';
import { PXR1_100, colors, maxHeights, keyframes, animations, fontSize, PXR1_300 } from './utils';

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
        height: {
            ...PXR1_300,
        },
        inset: {
            ...PXR1_300,
        },
    },
    spacing: {
        ...PXR1_100,
    },
};
export const plugins = [scrollbarHide];
