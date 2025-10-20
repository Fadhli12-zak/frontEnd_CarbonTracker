"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function StackedEmissionChart({ chartData }) {
  const data = {
    labels: ["Total Emisi"],
    datasets: chartData.map((item) => ({
      label: item.name,
      data: [item.percentage],
      backgroundColor: item.color,
      borderWidth: 0,
    })),
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        display: false,
        max: 100,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
    barThickness: 80,
  };

  return (
    <div className="h-16 w-10/12 ml-9 ">
      {" "}
      <Bar data={data} options={options} />
    </div>
  );
}
