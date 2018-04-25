
export const LANG_REG = /^[a-z]{2}$/;
export const COUNTRY_REG = /^[a-z]{2}$/;

export function unixTimestamp() {
    return Math.round(Date.now() / 1000);
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
