export const getCurrentDate = (): Date => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
};

export const startAndEndDate = (d: Date) => {
    // const startDate = new Date(d.getFullYear(), d.getMonth(), 2, -15);
    // const endDate = new Date(d.getFullYear(), d.getMonth() + 1, 1, 8, 59, 59, 999);
    const startDate = new Date(d.getFullYear(), d.getMonth(), 2);
    const endDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);

    return { startDate, endDate };
};

export const addDays = (d: Date, days: number) => {
    const newDate = new Date(d);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

export const addMinutes = (d: Date, minutes: number) => {
    const newDate = new Date(d);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
};

export const getMidnight = (d: Date) => {
    d.setHours(9, 0, 0, 0);
    return addDays(d, -1);
};

export function getYYYYMMDDHHMMSS(date: Date) {
    function pad2(n: number) {
        return (n < 10 ? '0' : '') + n;
    }

    return (
        date.getFullYear() +
        pad2(date.getMonth() + 1) +
        pad2(date.getDate()) +
        pad2(date.getHours()) +
        pad2(date.getMinutes()) +
        pad2(date.getSeconds())
    );
}

// export const yyyymmddhhmmss = function (date: Date) {
//   const yyyy = date.getFullYear().toString();
//   const MM = pad(date.getMonth() + 1, 2);
//   const dd = pad(date.getDate(), 2);
//   const hh = pad(date.getHours(), 2);
//   const mm = pad(date.getMinutes(), 2);
//   const ss = pad(date.getSeconds(), 2);
//
//   return yyyy + MM + dd + hh + mm + ss;
// };

export function yyyymmdd(date: Date) {
    const yyyy = date.getFullYear().toString();
    const MM = pad(date.getUTCMonth() + 1, 2);
    const dd = pad(date.getUTCDate(), 2);

    return yyyy + '.' + MM + '.' + dd;
}

export function koreanDateStr(date: Date) {
    const yyyy = date.getFullYear().toString();
    const MM = pad(date.getMonth() + 1, 2);
    const dd = pad(date.getDate(), 2);

    return yyyy + '년 ' + MM + '월 ' + dd + '일';
}

export function getStrfDateTime(inputDate: Date) {
    const date = new Date(inputDate);
    const y = date.getFullYear().toString();
    const m = date.getMonth() >= 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString();

    const d = date.getDate() >= 10 ? date.getDate().toString() : '0' + date.getDate().toString();

    const h = date.getHours() >= 10 ? date.getHours().toString() : '0' + date.getHours().toString();

    const mn = date.getMinutes() >= 10 ? date.getMinutes().toString() : '0' + date.getMinutes().toString();
    return `${y}-${m}-${d} ${h}:${mn}`;
}

function pad(number: number, length: number) {
    let str = String(number);
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
