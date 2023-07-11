type TDevice = 'iOS' | 'Android' | 'Unknown';

export const getDevice = (userAgent: string | null): TDevice => {
    const isIOS = userAgent?.match(/iPhone|iPad|iPod/i);
    if (isIOS) {
        return 'iOS';
    }

    const isAndroid = userAgent?.match(/Android/i);
    if (isAndroid) {
        return 'Android';
    }

    return 'Unknown';
};
