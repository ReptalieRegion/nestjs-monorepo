import { PXR1_100, colors, maxHeights } from './utils';

export const theme = {
    extend: {
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
