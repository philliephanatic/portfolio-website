document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("traffic-comparison-chart-canvas");
    const raw = document.getElementById("traffic-comparison-chart-script");

    if (!ctx || !raw) {
        console.warn("Missing canvas or data element.");
        return;
    }

    const { labels, companyATrafficValues, companyBTrafficValues } = JSON.parse(raw.textContent);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Company A",
                    data: companyATrafficValues,
                    backgroundColor: "rgba(54, 162, 235, 0.7)",
                },
                {
                    label: "Company B",
                    data: companyBTrafficValues,
                    backgroundColor: "rgba(255, 99, 132, 0.7)",
                },
            ]
        },
        options: {
            responsive: true,
              maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => new Intl.NumberFormat("en-US").format(value)
                    },
                    title: {
                        display: true,
                        text: "Monthly Sessions"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Month"
                    }
                }
            },
        }
    });
});