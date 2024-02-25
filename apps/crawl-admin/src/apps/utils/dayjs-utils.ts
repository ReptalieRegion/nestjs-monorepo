import dayjs, { OpUnitType } from 'dayjs';

export function isExpired(otpCreatedAt: Date, expirationMinutes: number, unit: OpUnitType): boolean {
    const currentTime = dayjs();
    const otpTime = dayjs(otpCreatedAt);
    const diffMinutes = currentTime.diff(otpTime, unit);
    return diffMinutes >= expirationMinutes;
}
