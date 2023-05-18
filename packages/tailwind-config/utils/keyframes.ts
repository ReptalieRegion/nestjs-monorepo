const scaleKeyframe = {
    '0%': {
        transform: 'scaleX(1) scaleY(1)',
    },
    '50%': {
        transform: 'scaleX(1.25) scaleY(1.15)',
    },
    '100%': {
        transform: 'scaleX(1) scaleY(1)',
    },
};

export const keyframes = {
    scaleKeyframe,
} as const;
