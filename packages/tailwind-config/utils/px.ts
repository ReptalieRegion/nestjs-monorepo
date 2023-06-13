const pxToRem = (px: number, base = 16) => `${px / base}rem`;

const makePXRRange = (length: number) => {
    return Array.from({ length }, (_, px) => px).reduce((acc: { [key: string]: string }, px) => {
        const key = `${px}pxr`;
        acc[key] = pxToRem(px);
        return acc;
    }, {});
};

export const PXR1_100 = makePXRRange(100);
export const PXR1_300 = makePXRRange(300);
