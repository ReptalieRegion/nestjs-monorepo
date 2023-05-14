const pxToRem = (px: number, base = 16) => `${px / base}rem`;

export const PXR1_100 = Array.from({ length: 100 }, (_, px) => px).reduce((acc: { [key: string]: string }, px) => {
    const key = `${px}pxr`;
    acc[key] = pxToRem(px);
    return acc;
}, {});
