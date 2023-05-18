import { PXR1_100, colors, maxHeights, keyframes, animations, fontSize } from './utils';

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
export const plugins = [];
