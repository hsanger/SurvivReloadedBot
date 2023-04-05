/**
 * Clean a string of Discord formatting.
 * @param str The string to clean.
 */
const discord = (str: string): string => str.replace(/\*\*\*|\*\*|\*|__|_|~~/g, r => `\\${r}`);

/**
 * Format a number into a condensed form.
 * @param num The number to format.
 */
const num = (num: number): string =>
    Math.abs(Number(num)) >= 1e21
        ? `${(Math.abs(Number(num)) / 1e21).toFixed(2)}S`
        : Math.abs(Number(num)) >= 1e18
            ? `${(Math.abs(Number(num)) / 1e18).toFixed(2)}QT`
            : Math.abs(Number(num)) >= 1e15
                ? `${(Math.abs(Number(num)) / 1e15).toFixed(2)}Q`
                : Math.abs(Number(num)) >= 1e12
                    ? `${(Math.abs(Number(num)) / 1e12).toFixed(2)}T`
                    : Math.abs(Number(num)) >= 1e9
                        ? `${(Math.abs(Number(num)) / 1e9).toFixed(2)}B`
                        : Math.abs(Number(num)) >= 1e6
                            ? `${(Math.abs(Number(num)) / 1e6).toFixed(2)}M`
                            : Math.abs(Number(num)) >= 1e3
                                ? `${(Math.round(Math.abs(Number(num)) / 1e3))}K`
                                : Math.abs(Number(num)).toString();

/**
 * Format a number by the number of bytes it contains, into a condensed form.
 * @param num The number to format.
 */
const bytes = (num: number): string =>
    Math.abs(Number(num)) >= 1024 ** 5
        ? `${(Math.abs(Number(num)) / 1024 ** 5).toFixed(2)}PiB`
        : Math.abs(Number(num)) >= 1024 ** 4
            ? `${(Math.abs(Number(num)) / 1024 ** 4).toFixed(2)}TiB`
            : Math.abs(Number(num)) >= 1024 ** 3
                ? `${(Math.abs(Number(num)) / 1024 ** 3).toFixed(2)}GiB`
                : Math.abs(Number(num)) >= 1024 ** 2
                    ? `${(Math.round(Math.abs(Number(num)) / 1024 ** 2))}MiB`
                    : Math.abs(Number(num)) >= 1024
                        ? `${(Math.round(Math.abs(Number(num)) / 1024))}KiB`
                        : Math.abs(Number(num)).toString();

/**
 * Format a date into a string.
 * @param time The date to format.
 */
const date = (time: Date): string => {
    const second = time.getSeconds().toString().padStart(2, `0`);
    const minute = time.getMinutes().toString().padStart(2, `0`);

    const hour = time.getHours().toString().padStart(2, `0`);
    const day = time.getDate().toString().padStart(2, `0`);

    const month = (time.getMonth() + 1).toString().padStart(2, `0`);
    const year = time.getFullYear().toString();

    return `${month}-${day}-${year} ${hour}:${minute}:${second}`;
};

/**
 * Format a time into a string.
 * @param ms The number, in milliseconds, to format.
 */
const time = (ms: number): string => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1e3));
    const hours = Math.floor(ms / (60 * 60 * 1e3)) % 24;
    const minutes = Math.floor(ms / (60 * 1e3)) % 60;
    const seconds = Math.floor(ms / 1e3) % 60;

    if (days > 0) return `${days} days, ${hours} hours, ${minutes} minutes`;
    else if (hours > 0) return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    else if (minutes > 0) return `${minutes} minutes, ${seconds} seconds`;
    else return `${seconds} seconds`;
};

const addCommaSeparators = (num: number): string => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`);

const toCapitalString = (string: string): string => string.toString().replace(/^\w/, f => f.toUpperCase()).split(/(?=[A-Z])/).join(` `);

const toCapitalStringFromArray = (array: string[]): string => array.join(``).toString().replace(/^\w/, f => f.toUpperCase()).split(/(?=[A-Z])/).join(` `);

export {
    discord,
    num,
    bytes,
    date,
    time,
    addCommaSeparators,
    toCapitalString,
    toCapitalStringFromArray
};
