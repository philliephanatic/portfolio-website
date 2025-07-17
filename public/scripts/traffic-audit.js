Chart.register(ChartDataLabels);

// !_TO DO_! work on global settings/defaults to create chart partials

//Global Formatting
Chart.defaults.set('plugins.datalabels', {
    formatter: (value) => `${(value * 100).toFixed(1)}%`,
    color: "white",
    font: {
        family: "Roboto",
        size: 14
    },

});

// Bar chart global defaults
Chart.defaults.elements.bar.borderWidth = 0;

// Pie chart global defaults
Chart.overrides.pie.borderWidth = 0;

// Bespoke Formattting 
// Millions with "M"
function formatMillions(value) {
    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + "M";
    } return value;
};

// Tens
function formatTens(value) {
    return (value * 1).toFixed(0)
};

document.addEventListener("DOMContentLoaded", () => {
    initTrafficComparisonBarChart();
    initCompanyAPieChart();
    initCompanyBPieChart();
    initAudienceSegmentBarChart();
    initGenderSegmentBarChart();
    initGeoSegmentBarChart();
    initBounceRateBarChart();
    initPagesPerVisitBarChart();
    initAvgVisitDuration()
});

// 📊 Grouped Bar Chart – Monthly Sessions
function initTrafficComparisonBarChart() {
    const raw = document.getElementById("traffic-comparison-script");
    const ctx = document.getElementById("traffic-comparison-canvas");

    if (!ctx || !raw) {
        console.warn("Missing chart canvas or data script.");
        return;
    }

    const { labels, companyATrafficValues, companyBTrafficValues } = JSON.parse(raw.textContent);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Company A",
                    data: companyATrafficValues,
                    backgroundColor: "rgba(54, 162, 235, 0.7)",
                },
                {
                    label: "Company B",
                    data: companyBTrafficValues,
                    backgroundColor: "rgba(255, 99, 132, 0.7)"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    }
                },
                title: {
                    display: true,
                    text: "Monthly Sessions",
                    color: "white",
                    font: {
                        family: "Fjalla One",
                        size: 30
                    }

                },
                datalabels: {
                    display: true,
                    formatter: value => formatMillions(value),
                    color: "white",
                    font: {
                        family: "Roboto",
                        size: 14
                    }
                },
                tooltip: {
                    bodyFont: {
                        family: "Roboto"
                    },
                    titleFont: {
                        family: "Roboto"
                    }
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => new Intl.NumberFormat("en-US").format(value),
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    title: {
                        display: true,
                        text: "Sessions",
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        },
                        padding: {
                            bottom: 10,
                        }
                    },
                    grid: {
                        color: "transparent",
                    }
                },
                x: {
                    border: {
                        display: "none",
                    },
                    ticks: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    title: {
                        display: true,
                        text: "Month",
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        },
                        padding: {
                            top: 0,
                        }
                    },
                    grid: {
                        color: "transparent"
                    }
                }
            },
        }
    });
}

// 🥧 Pie Chart – Company A Traffic Sources
function initCompanyAPieChart() {
    const raw = document.getElementById("companyA-traffic-source-script");
    const ctx = document.getElementById("companyA-traffic-source-canvas");

    if (!raw || !ctx) {
        console.warn("Missing chart canvas or data script.");
        return;
    }

    const { labels, values } = JSON.parse(raw.textContent);

    new Chart(ctx, {
        type: "pie",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"
                ],
                hoverOffset: 10
            }]
        },
        options: {
            response: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Company A Traffic Sources",
                    color: "white",
                    font: {
                        family: "Fjalla One",
                        size: 30
                    }
                },
                legend: {
                    font: {
                        family: "Roboto",
                        size: 18
                    },
                    position: "bottom",
                    labels: {
                        color: "white",
                        font: {
                            family: "Roboto"
                        },
                        usePointStyle: true,
                        pointStyle: "circle"
                    },
                },
                datalabels: {
                    display: "auto",
                },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            const label = ctx.label || "";
                            const value = ctx.raw || 0;
                            return `${label}: ${(value * 100).toFixed(1)}%`
                        }
                    }
                }
            }
        }
    })
}

// 🥧 Pie Chart – Company B Traffic Sources
function initCompanyBPieChart() {
    const raw = document.getElementById("companyB-traffic-source-script");
    const ctx = document.getElementById("companyB-traffic-source-canvas");
    if (!raw || !ctx) {
        console.warn("Missing chart canvas or data script.")
        return;
    }

    const { labels, values } = JSON.parse(raw.textContent);

    new Chart(ctx, {
        type: "pie",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"
                ],
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "Company B Traffic Sources",
                    color: "white",
                    font: {
                        family: "Fjalla One",
                        size: 30
                    }
                },
                datalabels: {
                    display: "auto",
                },
                legend: {
                    font: {
                        family: "Roboto",
                        size: 18
                    },
                    position: "bottom",
                    labels: {
                        color: "white",
                        font: {
                            family: "Roboto"
                        },
                        usePointStyle: true,
                        pointStyle: "circle"
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            const label = ctx.label || "";
                            const value = ctx.raw || 0;
                            return `${label}: ${(value * 100).toFixed(1)}%`
                        }
                    }
                }
            }
        }
    })
}

// 📊 Grouped Bar Chart – Audience Segment
function initAudienceSegmentBarChart() {
    const raw = document.getElementById("age-segment-script");
    const ctx = document.getElementById("age-segment-canvas");

    if (!ctx || (!raw)) {
        console.warn("Missing chart canvas or data script.")
        return;
    }

    const { audienceLabels, companyAAudienceSegment, companyBAudienceSegment } = JSON.parse(raw.textContent);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: audienceLabels,
            datasets: [
                {
                    label: "Company A",
                    data: companyAAudienceSegment,
                    backgroundColor: "rgba(54, 162, 235, 0.7)",
                },
                {
                    label: "Company B",
                    data: companyBAudienceSegment,
                    backgroundColor: "rgba(255, 99, 132, 0.7)"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    }
                },
                title: {
                    display: true,
                    text: "Age Range of Digital Consumers",
                    color: "white",
                    font: {
                        family: "Fjalla One",
                        size: 30
                    }
                },
                tooltip: {
                    bodyFont: {
                        family: "Roboto"
                    },
                    titleFont: {
                        family: "Roboto"
                    },
                    callbacks: {
                        label: function (ctx) {
                            const value = ctx.raw || 0;
                            return `${(value * 100).toFixed(1)}%`
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => new Intl.NumberFormat("en-US", { style: "percent" }).format(value),
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    title: {
                        display: true,
                        text: "% of Total Sessions",
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    grid: {
                        color: "transparent"
                    }
                },
                x: {
                    ticks: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    title: {
                        display: true,
                        text: "Age Range",
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    grid: {
                        color: "transparent"
                    }
                }
            }
        }
    })
};

// 📊 Grouped Bar Chart – Gender Segment
function initGenderSegmentBarChart() {
    const raw = document.getElementById("gender-segment-script");
    const ctx = document.getElementById("gender-segment-canvas");

    if (!ctx || !raw) {
        console.warn("Missing chart canvas or data script.")
        return;
    }

    const { genderLabels, companyAGenderSegment, companyBGenderSegment } = JSON.parse(raw.textContent);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: genderLabels,
            datasets: [
                {
                    label: "Company A",
                    data: companyAGenderSegment,
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                },
                {
                    label: "Company B",
                    data: companyBGenderSegment,
                    backgroundColor: "rgba(255, 99, 132, 0.7)"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        },
                    },
                    position: "bottom",
                },
                title: {
                    display: true,
                    text: "Gender Segment",
                    color: "white",
                    font: {
                        family: "Fjalla One",
                        size: 30
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const value = ctx.raw || 0;
                            return `${(value * 100).toFixed(1)}%`;
                        }
                    },
                    bodyFont: { family: "Roboto" },
                    titleFont: { family: "Roboto" }
                },
                datalabels: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `${(value * 100).toFixed(0)}%`,
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    grid: {
                        color: "transparent"
                    },
                    title: {
                        display: true,
                        text: "% of Total Users",
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    }
                },
                x: {
                    ticks: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    grid: {
                        color: "transparent"
                    }
                }
            }
        }
    });
}

// 📊 Grouped Bar Chart – Geo Segment
function initGeoSegmentBarChart() {
    const raw = document.getElementById("geo-segment-script");
    const ctx = document.getElementById("geo-segment-canvas");

    if (!ctx || !raw) {
        console.warn("Missing chart canvas or data script.")
        return;
    }

    const { geoLabels, companyAGeoSegment, companyBGeoSegment } = JSON.parse(raw.textContent);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: geoLabels,
            datasets: [
                {
                    label: "Company A",
                    data: companyAGeoSegment,
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                },
                {
                    label: "Company B",
                    data: companyBGeoSegment,
                    backgroundColor: "rgba(255, 99, 132, 0.7)"
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    position: "bottom",
                },
                title: {
                    display: true,
                    text: "Geo Segment",
                    color: "white",
                    font: {
                        family: "Fjalla One",
                        size: 30
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const value = ctx.raw || 0;
                            return `${(value * 100).toFixed(1)}%`;
                        }
                    },
                    bodyFont: { family: "Roboto" },
                    titleFont: { family: "Roboto" }
                },
                datalabels: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `${(value * 100).toFixed(0)}%`,
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    grid: {
                        color: "transparent"
                    },
                    title: {
                        display: true,
                        text: "% of Total Users",
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    }
                },
                x: {
                    ticks: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    grid: {
                        color: "transparent"
                    }
                }
            }
        }
    });
}

// 📊 Bounce Rate - Grouped Bar Chart
function initBounceRateBarChart() {
    const raw = document.getElementById("bounce-rate-script");
    const ctx = document.getElementById("bounce-rate-canvas");

    if (!ctx || !raw) {
        console.warn("Missing chart canvas or data script.")
        return;
    }

    const { bounceRateLabels, companyABounceRate, companyBBounceRate } = JSON.parse(raw.textContent);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: bounceRateLabels,
            datasets: [
                {
                    label: "Company A",
                    data: companyABounceRate,
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                },
                {
                    label: "Company B",
                    data: companyBBounceRate,
                    backgroundColor: "rgba(255, 99, 132, 0.7)"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    position: "bottom",
                },
                title: {
                    display: true,
                    text: "Bounce Rate",
                    color: "white",
                    font: {
                        family: "Fjalla One",
                        size: 30
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const value = ctx.raw || 0;
                            return `${(value * 100).toFixed(1)}%`;
                        }
                    },
                    bodyFont: { family: "Roboto" },
                    titleFont: { family: "Roboto" }
                },
                datalabels: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `${(value * 100).toFixed(0)}%`,
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    grid: {
                        color: "transparent"
                    },
                    title: {
                        display: false,
                    }
                },
                x: {
                    ticks: {
                        display: false,

                    },
                    grid: {
                        color: "transparent"
                    }
                }
            }
        }
    });
}

// 📊 Pages Per Visit - Grouped Bar Chart
function initPagesPerVisitBarChart() {
    const raw = document.getElementById("pages-per-visit-script");
    const ctx = document.getElementById("pages-per-visit-canvas");

    if (!ctx || !raw) {
        console.warn("Missing chart canvas or data script.")
        return;
    }

    const { pagesPerVisitLabels, companyAPagesPerVisit, companyBPagesPerVisit } = JSON.parse(raw.textContent);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: pagesPerVisitLabels,
            datasets: [
                {
                    label: "Company A",
                    data: companyAPagesPerVisit,
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                },
                {
                    label: "Company B",
                    data: companyBPagesPerVisit,
                    backgroundColor: "rgba(255, 99, 132, 0.7)"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    position: "bottom",
                },
                title: {
                    display: true,
                    text: "Pages per Visit",
                    color: "white",
                    font: {
                        family: "Fjalla One",
                        size: 30
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const value = ctx.raw || 0;
                            return `${(value * 1).toFixed(0)}`
                        }
                    },
                    bodyFont: { family: "Roboto" },
                    titleFont: { family: "Roboto" }
                },
                datalabels: {
                    formatter: value => formatTens(value),
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    grid: {
                        color: "transparent"
                    },
                    title: {
                        display: false,
                    }
                },
                x: {
                    ticks: {
                        display: false,
                    },
                    title: {
                        display: false
                    },
                    grid: {
                        color: "transparent"
                    }
                }
            }
        }
    });
}

// 📊 Avg Visit Duration - Bar Chart
function initAvgVisitDuration() {
    const raw = document.getElementById("avg-visit-duration-script");
    const ctx = document.getElementById("avg-visit-duration-canvas");

    if (!ctx || !raw) {
        console.warn("Missing chart canvas or data script.");
        return;
    }

    const { avgVisitDurationLabels, companyAAvgVisitDuration, companyBAvgVisitDuration } = JSON.parse(raw.textContent);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: avgVisitDurationLabels,
            datasets: [
                {
                    label: "Company A",
                    data: companyAAvgVisitDuration,
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                },
                {
                    label: "Company B",
                    data: companyBAvgVisitDuration,
                    backgroundColor: "rgba(255, 99, 132, 0.7)"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        }
                    },
                    position: "bottom"
                },
                title: {
                    display: true,
                    text: "Average Visit Duration",
                    color: "white",
                    font: {
                        family: "Fjalla One",
                        size: 30
                    }
                },
                datalabels: {
                    formatter: (value) => {
                        const mins = Math.floor(value / 60);
                        const secs = Math.floor(value % 60).toString().padStart(2, "0");
                        return `${mins}:${secs}`;
                    },
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "white",
                        callback: (value) => {
                            const mins = Math.floor(value / 60);
                            const secs = Math.floor(value % 60).toString().padStart(2, "0");
                            return `${mins}:${secs}`;
                        },
                        font: {
                            family: "Roboto",
                            size: 18
                        },
                    },
                    title: {
                        display: true,
                        text: "Minutes : Seconds",
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 18
                        },
                        padding: {
                            bottom: 10,
                        }
                    },
                    grid: {
                        color: "transparent"
                    },
                },

                x: {
                    ticks: {
                        display: false,
                    },
                    title: {
                        display: false
                    },
                    grid: {
                        color: "transparent"
                    }
                },
            },

        }
    });
}