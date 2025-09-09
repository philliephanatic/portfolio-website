// __!!CHARTS ONLY!!__
// /public/scripts/traffic-audit.js

import { onReady, getJSON, fmt } from "./utils/index.js";
import {
  applyGlobalChartDefaults,
  chartViewportOverrides,
  mergeOptions,
} from "./charts/config.js";

/* global Chart */
applyGlobalChartDefaults();

onReady(() => {
    initCoreWebVitalsStackedBarChart()
})

// 📊 Stacked Bar – Core Web Vitals

// function initCoreWebVitalsStackedBarChart() {
//     const data = getJSON("core-web-vitals-script");
//     const ctx = document.getElementById("core-web-vitals-canvas");
//     if (!data || !ctx) return;

//     const { labels, lcpGood, inpGood, clsGood } = data;

//     new chartViewportOverrides(ctx, {
//         type: 1,
//         data: 1,
//         options: 1,

//         }),
//     };

