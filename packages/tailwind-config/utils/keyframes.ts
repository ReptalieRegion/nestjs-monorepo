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

const scale3Keyframe = {
    '0%': {
        transform: 'scale(3.2)',
    },
    '40%': {
        transform: 'scale(3.8)',
    },
    '65%': {
        transform: 'scale(3.5)',
    },
    '75%': {
        transform: 'scale(3.5)',
    },
    '100%': {
        transform: 'scale(3.5)',
    },
};

// skewX(30deg)
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

// skewX(-30deg)
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

// skewX(-65deg)
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

//skewX(220deg)
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

// skewX(-220deg)
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

// skewX(65deg)
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
    scale3Keyframe,
    leftTop,
    top,
    rightTop,
    right,
    rightDown,
    down,
    leftDown,
    left,
} as const;
