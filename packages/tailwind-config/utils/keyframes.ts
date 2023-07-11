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

const scaleKey2frame = {
    '0%': {
        transform: 'scale(0.7)',
    },
    '40%': {
        transform: 'scale(1.3)',
    },
    '65%': {
        transform: 'scale(1)',
    },
    '75%': {
        transform: 'scale(1)',
    },
    '100%': {
        transform: 'scale(1)',
    },
};

const scale3Keyframe = {
    '0%': {
        transform: 'scale(1.5)',
    },
    '40%': {
        transform: 'scale(2.1)',
    },
    '65%': {
        transform: 'scale(1.8)',
    },
    '75%': {
        transform: 'scale(1.8)',
    },
    '100%': {
        transform: 'scale(1.8)',
    },
};

const elementUpKeyframe = {
    '0%': {
        opacity: '0',
        bottom: '0',
    },
    '100%': {
        opacity: '1',
        bottom: '3.75rem',
    },
};

const elementDownKeyframe = {
    '0%': {
        opacity: '1',
        bottom: '3.75rem',
    },
    '100%': {
        opacity: '0',
        bottom: '0rem',
    },
};

const leftTop = {
    '0%': {
        transform: 'translateX(-50%)',
    },
    '100%': {
        height: 0,
        width: 0,
        transform: 'translateX(-150%) translateY(-50%)',
    },
};

const top = {
    '0%': {
        transform: 'translateX(-50%)',
    },
    '100%': {
        height: 0,
        width: 0,
        transform: 'translateY(-100%) translateX(-50%)',
    },
};

const rightTop = {
    '0%': {
        transform: 'translateX(-50%)',
    },
    '100%': {
        height: 0,
        width: 0,
        transform: 'translateX(50%) translateY(-50%)',
    },
};

const right = {
    '0%': {
        transform: 'translateX(-50%)',
    },
    '100%': {
        height: 0,
        width: 0,
        transform: 'translateX(50%)',
    },
};

const rightDown = {
    '0%': {
        transform: 'translateX(-50%)',
    },
    '100%': {
        height: 0,
        width: 0,
        transform: 'translateX(50%) translateY(50%)',
    },
};

const down = {
    '0%': {
        transform: 'translateX(-50%)',
    },
    '100%': {
        height: 0,
        width: 0,
        transform: 'translateY(100%) translateX(-50%)',
    },
};

const leftDown = {
    '0%': {
        transform: 'translateX(-50%)',
    },
    '100%': {
        height: 0,
        width: 0,
        transform: 'translateX(-150%) translateY(50%)',
    },
};

const left = {
    '0%': {
        transform: 'translateX(-50%)',
    },
    '100%': {
        height: 0,
        width: 0,
        transform: 'translateX(-150%)',
    },
};

export const keyframes = {
    scaleKeyframe,
    scaleKey2frame,
    scale3Keyframe,
    elementUpKeyframe,
    elementDownKeyframe,
    leftTop,
    top,
    rightTop,
    right,
    rightDown,
    down,
    leftDown,
    left,
} as const;
