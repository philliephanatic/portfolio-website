//__!!CHARTS CONFIG!!__//
// public/scripts/charts/config.js

/* global Chart, ChartDataLabels */
export function applyGlobalChartDefaults() {
  // Bail if Chart didn’t load for some reason
  if (typeof Chart === "undefined") return;

  // Register datalabels if present (UMD plugin on window)
  if (typeof ChartDataLabels !== "undefined") {
    try {
      Chart.register(ChartDataLabels);
    } catch (_) {}
  }

  // Top-level defaults (safe)
  Chart.defaults.color = "white";
  Chart.defaults.font = { family: "Roboto", size: 14 };

  // Elements (safe guards)
  Chart.defaults.elements = Chart.defaults.elements || {};
  Chart.defaults.elements.bar = {
    ...(Chart.defaults.elements.bar || {}),
    borderWidth: 0,
  };

  // Pie override (guard)
  Chart.overrides = Chart.overrides || {};
  Chart.overrides.pie = { ...(Chart.overrides.pie || {}), borderWidth: 0 };

  // Plugin defaults (create nested objects before writing)
  Chart.defaults.plugins = Chart.defaults.plugins || {};
  Chart.defaults.plugins.title = {
    ...(Chart.defaults.plugins.title || {}),
    display: true,
    color: "white",
    font: { family: "Fjalla One", size: 30 },
    padding: { top: 0, bottom: 12 },
  };
  Chart.defaults.plugins.legend = Chart.defaults.plugins.legend || {};
  Chart.defaults.plugins.legend.labels = {
    ...(Chart.defaults.plugins.legend.labels || {}),
    color: "white",
    font: { family: "Roboto", size: 18 },
  };

  // Datalabels defaults (Chart.js v4-safe)
  if (typeof Chart.defaults.set === "function") {
    Chart.defaults.set("plugins.datalabels", {
      display: "auto",
      color: "white",
      font: { family: "Roboto", size: 14 },
      formatter: (v) => v,
      clamp: true,
    });
  }

  // ⚠️ DO NOT mutate deep scale defaults globally (these may be undefined in UMD)
  // Instead, set grid/ticks per-chart (which you’re already doing).
}

/* ===== viewport optimization ===== */
// -- Breakpoints used across charts (XS, S, M, L, XL)
const MQ = {
  xs: "(max-width: 600px)",
  s: "(min-width: 601px) and (max-width: 768px)",
  m: "(min-width: 769px) and (max-width: 1024px)",
  l: "(min-width: 1025px) and (max-width: 1440px)",
  xl: "(min-width: 1441px)",
};

/** Return chart option overrides for the current viewport */
export function chartViewportOverrides(win = window, kind = "bar") {
  if (typeof win === "undefined" || !win.matchMedia) return {};

  const isXS = win.matchMedia(MQ.xs).matches;
  const isS = win.matchMedia(MQ.s).matches;
  const isM = win.matchMedia(MQ.m).matches;
  const isL = win.matchMedia(MQ.l).matches;
  const isXL = win.matchMedia(MQ.xl).matches;

  // sensible defaults (desktop-ish)
  let titleSize = 30;
  let tickSize = 18;
  let labelBox = 10;

  if (isXS) {
    titleSize = 18;
    tickSize = 10;
    labelBox = 8;
  } else if (isS) {
    titleSize = 20;
    tickSize = 12;
    labelBox = 8;
  } else if (isM) {
    titleSize = 24;
    tickSize = 14;
    labelBox = 10;
  } else if (isL) {
    titleSize = 28;
    tickSize = 16;
    labelBox = 10;
  } else if (isXL) {
    titleSize = 32;
    tickSize = 20;
    labelBox = 12;
  }

  // Base plugin scaling that applies to all kinds
  const base = {
    plugins: {
      title: { font: { size: titleSize } },
      legend: {
        labels: {
          boxWidth: labelBox,
          boxHeight: labelBox,
          font: { size: tickSize },
        },
      },
      datalabels: { font: { size: Math.max(10, tickSize - 2) } },
    },
  };

  if (kind === "pie") {
    // Pie: legend bottom; no scales (no ticks at all)
    return {
      ...base,
      plugins: {
        ...base.plugins,
        legend: { ...base.plugins.legend, position: "bottom", display: true },
      },
      // no `scales` key → avoids any axes/ticks showing on pies
    };
  }

  // Bar (default): legend top; ticks ON (no grid/borders)
  return {
    ...base,
    plugins: {
      ...base.plugins,
      legend: { ...base.plugins.legend, position: "top" },
    },
    scales: {
      x: {
        ticks: { display: true, font: { size: tickSize } },
        grid: { display: false, drawBorder: false }, // omit drawTicks → defaults to true (tick marks ON)
        border: { display: false },
      },
      y: {
        ticks: { display: true, font: { size: tickSize } },
        grid: { display: false, drawBorder: false },
        border: { display: false },
      },
    },
  };
}

/** Minimal deep merge for Chart.js option objects */
export function mergeOptions(base = {}, ...overrides) {
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  const out = { ...base };
  for (const src of overrides) {
    if (!isObj(src)) continue;
    for (const k of Object.keys(src)) {
      const v = src[k];
      out[k] = isObj(v) ? mergeOptions(out[k] || {}, v) : v;
    }
  }
  return out;
}
