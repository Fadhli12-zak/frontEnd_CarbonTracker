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

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function MonthlyEmissionChart({ monthlyData = {} }) {

  const lowData = MONTHS.map((month) => monthlyData[month]?.rendah || 0);
  const mediumData = MONTHS.map((month) => monthlyData[month]?.sedang || 0);
  const highData = MONTHS.map((month) => monthlyData[month]?.tinggi || 0);

  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: "Rendah (0-20%)",
        data: lowData,
        backgroundColor: "#ADFF2F", 
        borderWidth: 0,
        stack: "Stack 0", 
      },
      {
        label: "Sedang (21-45%)",
        data: mediumData,
        backgroundColor: "#FFA500", 
        borderWidth: 0,
        stack: "Stack 0",
      },
      {
        label: "Tinggi (46-100%)",
        data: highData,
        backgroundColor: "#FF1493", 
        borderWidth: 0,
        stack: "Stack 0",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.raw > 0) {
              return `${context.dataset.label}: ${context.raw}%`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false, 
        },
        ticks: {
          color: "#FFFFFF",
        },
        border: {
          color: "#FFFFFF",
        },
      },
      y: {
        stacked: true, 
        beginAtZero: true,
        max: 100,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          color: "#FFFFFF",
        },
      },
    },
    datasets: {
      bar: {
        barPercentage: 0.6, 
        categoryPercentage: 0.7, 
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
