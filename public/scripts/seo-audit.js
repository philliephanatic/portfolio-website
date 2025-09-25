// __!!CHARTS ONLY!!__
// /public/scripts/traffic-audit.js

import { onReady, getJSON, fmt } from "./utils/index.js";
import {
  applyGlobalChartDefaults,
  chartViewportOverrides,
  mergeOptions,
} from "./charts/config.js";

// Reusable scale snippet: no grid, no borders, no tick marks
const noGrid = () => ({
  grid: { display: false, drawBorder: false, drawTicks: false },
  border: { display: false },
});

// Merge helper so every chart gets: responsive + your options + viewport profile
const opt = (kind, base) =>
  mergeOptions(
    { responsive: true, maintainAspectRatio: false },
    base,
    chartViewportOverrides(window, kind)
  );

/* global Chart */
applyGlobalChartDefaults();

onReady(() => {
  initLcpComparisonStackedBarChart();
});

// 📊 Stacked Bar – Core Web Vitals
function initLcpComparisonStackedBarChart() {
  const data = getJSON("lcp-comparison-script");
  const ctx = document.getElementById("lcp-comparison-canvas");
  if (!data || !ctx) return;

  const {labels, companyA, companyB } = data;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels, // ["January","February","March"]
      datasets: [
        {
          label: "Company A",
          data: companyA, // [JanAvgMs, FebAvgMs, MarAvgMs]
          // keep your styling choices; colors are placeholders
          backgroundColor: "rgba(54,162,235,0.7)",
          borderWidth: 0,
        },
        {
          label: "Company B",
          data: companyB,
          backgroundColor: "rgba(255,99,132,0.7)",
          borderWidth: 0,
        },
      ],
    },
    options: opt("bar", {
      // Ensure grouped bars (not stacked)
      scales: {
        x: { ...noGrid(), stacked: false, title: { display: true, text: "Month" } },
        y: {
          ...noGrid(),
          stacked: false,
          beginAtZero: true,
          title: { display: true, text: "Milliseconds" },
          ticks: { callback: (v) => `${fmt.number(v)} ms` },
        },
      },
      plugins: {
        title: { display: true, text: "Monthly Average" },
        subtitle: {display: false, text: "Monthly Average"},
        tooltip: {
          callbacks: {
            label: (c) => `${c.dataset.label}: ${fmt.number(c.raw)} ms`,
          },
        },
        // If you use chartjs-plugin-datalabels:
        datalabels: {
          formatter: (v) => `${fmt.number(v)} ms`,
          anchor: "end",
          align: "end",
        },
      },
    }),
  });
}

