Chart.register(ChartDataLabels);

Chart.defaults.set('plugins.datalabels', {
    formatter: (value) => `${(value * 100).toFixed(1)}%`,
    color: "white",
    font: { family: "Roboto", size: 14 },
});

document.addEventListener("DOMContentLoaded", () => {
    initTrafficComparisonBarChart();
    initCompanyAPieChart();
    initCompanyBPieChart();
});

// 📊 Grouped Bar Chart – Monthly Sessions
function initTrafficComparisonBarChart() {
    const ctx = document.getElementById("traffic-comparison-chart-canvas");
    const raw = document.getElementById("traffic-comparison-chart-script");

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


            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => new Intl.NumberFormat("en-US").format(value),
                        color: "white"
                    },
                    title: {
                        display: true,
                        text: "Sessions",
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 14
                        }
                    },
                    grid: {
                        color: "transparent"
                    }
                },
                x: {
                    ticks: {
                        color: "white"
                    },
                    title: {
                        display: true,
                        text: "Month",
                        color: "white",
                        font: {
                            family: "Roboto",
                            size: 14
                        }
                    },
                    grid: {
                        color: "transparent"
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: {
                            family: "Roboto"
                        }
                    }
                },
                title: {
                    display: true,
                    text: "Monthly Sessions",
                    color: "white",
                    font: {
                        family: "Fjalla One",
                        size: 20
                    },
                },
                datalabels: {
                    display: false,
                },
                tooltip: {
                    bodyFont: {
                        family: "Roboto"
                    },
                    titleFont: {
                        family: "Roboto"
                    }
                }
            }
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
                    font: { family: "Fjalla One", size: 18 }
                },
                legend: {
                    labels: {
                        color: "white", font: { family: "Roboto" }
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
                    font: { family: "Fjalla One", size: 18 }
                },
                datalabels: {
                    display: "auto",
                },
                legend: {
                    labels: {
                        color: "white",
                        font: { family: "Roboto" }
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
