"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const ALL_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei", 
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const getEmissionStyle = (level) => {
  if (level === "Buruk") {
    return { color: "#FF1493" }; 
  }
  if (level === "Sedang") {
    return { color: "#FFA500" };
  }
  if (level === "Baik") {
    return { color: "#ADFF2F" }; 
  }
  return { color: "#BDC3C7" }; 
};

export default function MonthlyEmissionChart({ monthlyData = [] }) {
  const monthlyTotals = {};
  const monthlyColors = {};
  ALL_MONTHS.forEach((month) => {
    monthlyTotals[month] = 0;
    monthlyColors[month] = "transparent";
  });

  if (Array.isArray(monthlyData)) {
    monthlyData.forEach((item) => {
      if (item && item.month) {
        const monthName = item.month.split(" ")[0];
        if (monthlyTotals.hasOwnProperty(monthName)) {
          monthlyTotals[monthName] = item.total_emission;
          monthlyColors[monthName] = getEmissionStyle(item.level).color;
        }
      }
    });
  }

  const data = {
    labels: ALL_MONTHS,
    datasets: [
      {
        label: "Total Emisi (kg CO2)",
        data: ALL_MONTHS.map((month) => monthlyTotals[month]),
        backgroundColor: ALL_MONTHS.map((month) => monthlyColors[month]),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.raw > 0) {
              return `Total Emisi: ${context.raw.toFixed(2)} kg CO2`;
            }
            return null;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#FFFFFF" },
        border: { display: true, color: "#FFFFFF" },
        title: {
          display: true,
          text: "Bulan",
          color: "#FFFFFF",
          align: "end",
          padding: { top: 10 },
        },
      },
      y: {
        beginAtZero: true,
        max: monthlyData && monthlyData.length === 0 ? 1 : undefined,
        grid: { display: false },
        ticks: { display: false },
        border: { display: true, color: "#FFFFFF" },
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
    <div className="h-full w-full">
            <Bar data={data} options={options} />    {" "}
    </div>
  );
}
