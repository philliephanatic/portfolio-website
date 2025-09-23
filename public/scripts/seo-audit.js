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

  const { companyAJanLabels, companyAJanLcpGoodShare, companyBJanLcpGoodShare } = data;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: companyAJanLabels,
      datasets: [
        {
          label: "Company A",
          data: companyAJanLcpGoodShare,
          backgroundColor: "rgba(54,162,235,0.7)",
        },
        {
          label: "Company B",
          data: companyBJanLcpGoodShare,
          backgroundColor: "rgba(255,99,132,0.7)",
        },
      ],
    },
    options: opt("bar", {
          plugins: {
            title: { text: "Largest Content Paint" },
            datalabels: { formatter: (v) => fmt.percent(v) },
            tooltip: {
              callbacks: {
                label: (c) => `${c.dataset.label}: ${fmt.number(c.raw)}`,
              },
              bodyFont: { family: "Roboto" },
              titleFont: { family: "Roboto" },
            },
          },
          scales: {
            y: {
              ...noGrid(),
              beginAtZero: true,
              ticks: { callback: (v) => fmt.number(v) },
              title: { display: true, text: "% of sessions loading within 2.5s.", padding: { bottom: 10 } },
            },
            x: { ...noGrid(), title: { display: true  } },
          },
        }),
  });
}
