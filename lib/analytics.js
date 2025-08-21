// lib/analytics.js - SERVER-SIDE only utilities

/** Format ISO date (minus one month) to "Month YYYY" */
export function formatDate(isoString) {
    const d = new Date(isoString);
    d.setMonth(d.getMonth() - 1);
    return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

/** Sort age distribution by minAge and map to {label, value} */
export function formatAndSortAudienceSegmentData(ageDistribution = []) {
    return [...ageDistribution]
        .sort((a, b) => a.minAge - b.minAge)
        .map((item) => ({
            label: `${item.minAge} - ${item.maxAge}`,
            value: item.value
        }));
}

/** "HH:MM:SS" → seconds (number) */
export function convertToSeconds(timeStr) {
    const [hh = 0, mm = 0, ss = 0] = String(timeStr).split(":").map(Number);
    return (hh * 3600) + (mm * 60) + ss;
}

/** Percent change from old → next. Returns integer %, or 0 if old is 0. */
export function calculatePercentChange(oldValue, newValue) {
    if (typeof oldValue !== "number" || typeof newValue !== "number") {
        throw new Error("Both inputs must be numbers");
    }
    if (oldValue === 0) return 0;
    return Math.round(((newValue - oldValue) / oldValue) * 100);
}

/** Sum array of fractional shares to a percentage (e.g., [0.12,0.08] → 20.00) */
export function sumArrayPercentage(arr = []) {
    const sum = arr.reduce((acc, v) => acc + Number(v || 0), 0);
    return Number((sum * 100).toFixed(2));
}

/** Round sum of an array to the nearest whole number */
export function sumArrayWholeNumber(arr = []) {
    const sum = arr.reduce((acc, v) => acc + Number(v || 0), 0);
    return Math.round(sum);
}

/** Round numeric metric: ≥1 → nearest int; <1 → percentage basis (two decimals) */
export function roundNumber(num) {
    if (typeof num !== "number") return 0;
    return num >= 1 ? Math.round(num) : Math.round(num * 100);
}
