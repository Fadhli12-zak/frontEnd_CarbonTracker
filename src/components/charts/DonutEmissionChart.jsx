"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

export default function DonutEmissionChart({ percentage, color }) {
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, "#E5E7EB"],
        borderColor: ["transparent", "transparent"],
        hoverBorderColor: ["transparent", "transparent"],
        cutout: "60%",
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: true,
  };

  return (
    <div className="relative h-40 w-40">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-primary-green">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
