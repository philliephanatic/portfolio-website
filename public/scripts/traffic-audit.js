//__!!CHARTS ONLY!!__//
// /public/scripts/traffic-audit.js

import { onReady, getJSON, fmt } from "./utils/index.js";
import { applyGlobalChartDefaults } from "./charts/config.js";

// Reusable scale snippet: no grid, no borders, no tick marks
const noGrid = () => ({
  grid: { display: false, drawBorder: false, drawTicks: false },
  border: { display: false },
});

/* global Chart */
applyGlobalChartDefaults();

onReady(() => {
  initTrafficComparisonBarChart();
  initCompanyAPieChart();
  initCompanyBPieChart();
  initAudienceSegmentBarChart();
  initGenderSegmentBarChart();
  initGeoSegmentBarChart();
  initBounceRateBarChart();
  initPagesPerVisitBarChart();
  initAvgVisitDuration();
});

// 📊 Grouped Bar – Monthly Sessions
function initTrafficComparisonBarChart() {
  const data = getJSON("traffic-comparison-script");
  const ctx = document.getElementById("traffic-comparison-canvas");
  if (!data || !ctx) return;

  const { labels, companyATrafficValues, companyBTrafficValues } = data;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Company A",
          data: companyATrafficValues,
          backgroundColor: "rgba(54,162,235,0.7)",
        },
        {
          label: "Company B",
          data: companyBTrafficValues,
          backgroundColor: "rgba(255,99,132,0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { text: "Monthly Sessions" },
        datalabels: { formatter: (v) => fmt.millions(v) },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${fmt.number(ctx.raw)}`,
          },
          bodyFont: { family: "Roboto" },
          titleFont: { family: "Roboto" },
        },
      },
      scales: {
        y: {
          ...noGrid(),
          beginAtZero: true,
          ticks: { callback: (v) => fmt.number(v), font: { size: 18 } },
          title: {
            display: true,
            text: "Sessions",
            font: { size: 18 },
            padding: { bottom: 10 },
          },
        },
        x: {
          ...noGrid(),
          border: { display: false },
          ticks: { font: { size: 18 } },
          title: { display: true, text: "Month", font: { size: 18 } },
        },
      },
    },
  });
}

// 🥧 Pie – Company A Traffic Sources
function initCompanyAPieChart() {
  const data = getJSON("companyA-traffic-source-script");
  const ctx = document.getElementById("companyA-traffic-source-canvas");
  if (!data || !ctx) return;

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { text: "Company A Traffic Sources" },
        datalabels: { formatter: (v) => fmt.percent(v) },
        legend: {
          position: "bottom",
          labels: { usePointStyle: true, pointStyle: "circle" },
        },
        tooltip: {
          callbacks: { label: (c) => `${c.label}: ${fmt.percent(c.raw)}` },
        },
      },
    },
  });
}

// 🥧 Pie – Company B Traffic Sources
function initCompanyBPieChart() {
  const data = getJSON("companyB-traffic-source-script");
  const ctx = document.getElementById("companyB-traffic-source-canvas");
  if (!data || !ctx) return;

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF",
          ],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { text: "Company B Traffic Sources" },
        datalabels: { formatter: (v) => fmt.percent(v) },
        legend: {
          position: "bottom",
          labels: { usePointStyle: true, pointStyle: "circle" },
        },
        tooltip: {
          callbacks: { label: (c) => `${c.label}: ${fmt.percent(c.raw)}` },
        },
      },
    },
  });
}

// 📊 Bar – Age Segment
function initAudienceSegmentBarChart() {
  const data = getJSON("age-segment-script");
  const ctx = document.getElementById("age-segment-canvas");
  if (!data || !ctx) return;

  const { audienceLabels, companyAAudienceSegment, companyBAudienceSegment } =
    data;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: audienceLabels,
      datasets: [
        {
          label: "Company A",
          data: companyAAudienceSegment,
          backgroundColor: "rgba(54,162,235,0.7)",
        },
        {
          label: "Company B",
          data: companyBAudienceSegment,
          backgroundColor: "rgba(255,99,132,0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { text: "Age" },
        tooltip: { callbacks: { label: (c) => fmt.percent(c.raw) } },
        datalabels: { formatter: (v) => fmt.percent(v, 0) },
      },
      scales: {
        y: {
          ...noGrid(),
          beginAtZero: true,
          ticks: {
            callback: (v) =>
              new Intl.NumberFormat("en-US", { style: "percent" }).format(v),
            font: { size: 18 },
          },
          title: {
            display: true,
            text: "% of Total Sessions",
            font: { size: 18 },
          },
        },
        x: {
          ...noGrid(),
          ticks: { font: { size: 18 } },
          title: { display: true, text: "Age Range", font: { size: 18 } },
        },
      },
    },
  });
}

// 📊 Bar – Gender Segment
function initGenderSegmentBarChart() {
  const data = getJSON("gender-segment-script");
  const ctx = document.getElementById("gender-segment-canvas");
  if (!data || !ctx) return;

  const { genderLabels, companyAGenderSegment, companyBGenderSegment } = data;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: genderLabels,
      datasets: [
        {
          label: "Company A",
          data: companyAGenderSegment,
          backgroundColor: "rgba(54,162,235,0.7)",
        },
        {
          label: "Company B",
          data: companyBGenderSegment,
          backgroundColor: "rgba(255,99,132,0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { text: "Gender" },
        legend: { display: false },
        datalabels: { formatter: (v) => fmt.percent(v, 0) },
        tooltip: { callbacks: { label: (c) => fmt.percent(c.raw) } },
      },
      scales: {
        y: {
          ...noGrid(),
          beginAtZero: true,
          ticks: {
            callback: (v) => `${(v * 100).toFixed(0)}%`,
            font: { size: 18 },
          },
          title: {
            display: true,
            text: "% of Total Users",
            font: { size: 18 },
          },
        },
        x: {
          ...noGrid(),
          ticks: { font: { size: 18 } },
        },
      },
    },
  });
}

// 📊 Bar – Geo Segment
function initGeoSegmentBarChart() {
  const data = getJSON("geo-segment-script");
  const ctx = document.getElementById("geo-segment-canvas");
  if (!data || !ctx) return;

  const { geoLabels, companyAGeoSegment, companyBGeoSegment } = data;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: geoLabels,
      datasets: [
        {
          label: "Company A",
          data: companyAGeoSegment,
          backgroundColor: "rgba(54,162,235,0.7)",
        },
        {
          label: "Company B",
          data: companyBGeoSegment,
          backgroundColor: "rgba(255,99,132,0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { text: "Geography" },
        legend: { display: false },
        datalabels: { formatter: (v) => fmt.percent(v, 0) },
        tooltip: { callbacks: { label: (c) => fmt.percent(c.raw) } },
      },
      scales: {
        y: {
          ...noGrid(),
          beginAtZero: true,
          ticks: {
            callback: (v) => `${(v * 100).toFixed(0)}%`,
            font: { size: 18 },
          },
          title: {
            display: true,
            text: "% of Total Users",
            font: { size: 18 },
          },
        },
        x: {
          ...noGrid(),
          ticks: { font: { size: 18 } },
        },
      },
    },
  });
}

// 📊 Bar – Bounce Rate
function initBounceRateBarChart() {
  const data = getJSON("bounce-rate-script");
  const ctx = document.getElementById("bounce-rate-canvas");
  if (!data || !ctx) return;

  const { bounceRateLabels, companyABounceRate, companyBBounceRate } = data;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: bounceRateLabels,
      datasets: [
        {
          label: "Company A",
          data: companyABounceRate,
          backgroundColor: "rgba(54,162,235,0.7)",
        },
        {
          label: "Company B",
          data: companyBBounceRate,
          backgroundColor: "rgba(255,99,132,0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { text: "Bounce Rate" },
        legend: { position: "top" },
        datalabels: { formatter: (v) => fmt.percent(v) },
        tooltip: {
          callbacks: {
            label: (c) => `${c.dataset.label}: ${fmt.percent(c.raw)}`,
          },
        },
      },
      scales: {
        y: {
          ...noGrid(),
          beginAtZero: true,
          ticks: {
            callback: (v) => `${(v * 100).toFixed(0)}%`,
            font: { size: 18 },
          },
        },
        x: {
          ...noGrid(),
          ticks: { display: false },
        },
      },
    },
  });
}

// 📊 Bar – Pages per Visit
function initPagesPerVisitBarChart() {
  const data = getJSON("pages-per-visit-script");
  const ctx = document.getElementById("pages-per-visit-canvas");
  if (!data || !ctx) return;

  const { pagesPerVisitLabels, companyAPagesPerVisit, companyBPagesPerVisit } =
    data;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: pagesPerVisitLabels,
      datasets: [
        {
          label: "Company A",
          data: companyAPagesPerVisit,
          backgroundColor: "rgba(54,162,235,0.7)",
        },
        {
          label: "Company B",
          data: companyBPagesPerVisit,
          backgroundColor: "rgba(255,99,132,0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { text: "Pages per Visit" },
        legend: { display: false },
        datalabels: { formatter: (v) => fmt.tens(v) },
        tooltip: {
          callbacks: { label: (c) => `${c.dataset.label}: ${fmt.tens(c.raw)}` },
        },
      },
      scales: {
        y: {
          ...noGrid(),
          beginAtZero: true,
          ticks: { font: { size: 18 } },
        },
        x: {
          ...noGrid(),
          ticks: { display: false },
        },
      },
    },
  });
}

// 📊 Bar – Avg Visit Duration (mm:ss)
function initAvgVisitDuration() {
  const data = getJSON("avg-visit-duration-script");
  const ctx = document.getElementById("avg-visit-duration-canvas");
  if (!data || !ctx) return;

  const {
    avgVisitDurationLabels,
    companyAAvgVisitDuration,
    companyBAvgVisitDuration,
  } = data;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: avgVisitDurationLabels,
      datasets: [
        {
          label: "Company A",
          data: companyAAvgVisitDuration,
          backgroundColor: "rgba(54,162,235,0.7)",
        },
        {
          label: "Company B",
          data: companyBAvgVisitDuration,
          backgroundColor: "rgba(255,99,132,0.7)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { text: "Avg Visit Duration" },
        legend: { display: false },
        datalabels: { formatter: (v) => fmt.mmss(v) },
        tooltip: {
          callbacks: { label: (c) => `${c.dataset.label}: ${fmt.mmss(c.raw)}` },
          bodyFont: { family: "Roboto" },
          titleFont: { family: "Roboto" },
        },
      },
      scales: {
        y: {
          ...noGrid(),
          beginAtZero: true,
          ticks: { callback: (v) => fmt.mmss(v), font: { size: 18 } },
          title: {
            display: true,
            text: "Minutes : Seconds",
            font: { size: 18 },
            padding: { bottom: 10 },
          },
        },
        x: {
          ...noGrid(),
          ticks: { display: false },
          title: { display: false },
        },
      },
    },
  });
}
