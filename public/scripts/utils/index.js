// CLIENT-SIDE (browser) utilities
// public/scripts/utils/index.js

export const qs = (sel, root = document) => root.querySelector(sel);

/** Read JSON from <script type="application/json" id="..."> */
export function getJSON(scriptId) {
  const el = document.getElementById(scriptId);
  if (!el) {
    console.warn(`[getJSON] Missing script#${scriptId}`);
    return null;
  }
  try {
    return JSON.parse(el.textContent);
  } catch (e) {
    console.warn(`[getJSON] Bad JSON in #${scriptId}`, e);
    return null;
  }
}

/** DOM ready */
export const onReady = (cb) =>
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", cb, { once: true })
    : cb();

/** Formatters */
export const fmt = {
  millions(v) {
    return v >= 1_000_000
      ? (v / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
      : String(v);
  },
  tens(v) {
    return (v * 1).toFixed(0);
  },
  percent(p, d = 1) {
    return `${(p * 100).toFixed(d)}%`;
  },
  number(v, locale = "en-US") {
    return new Intl.NumberFormat(locale).format(v);
  },
  mmss(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  },
};
