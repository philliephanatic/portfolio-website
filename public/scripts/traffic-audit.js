document.addEventListener("DOMContentLoaded", () => {
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
          backgroundColor: "rgba(54, 162, 235, 0.7)"
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
      }
    }
  });
});
