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
