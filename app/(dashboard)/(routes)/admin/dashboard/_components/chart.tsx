"use client";

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ChartProps {
  data: { category: string; totals: number[] }[];
  chartType: 'bar' | 'line';
}

interface CategoryColors {
  Books: string;
  Reviews: string;
  Bookmarks: string;
  [key: string]: string;
}

const CustomChart: React.FC<ChartProps> = ({ data, chartType }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const categoryColors: CategoryColors = {
      Books: 'gray',
      Reviews: 'brown',
      Bookmarks: 'orange',
    };

    const existingChart = Chart.getChart(chartRef.current);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: chartType,
      data: {
        labels: data.map(item => item.category),
        datasets: data[0].totals.map((_, index) => ({
          label: Object.keys(categoryColors)[index],
          data: data.map(item => item.totals[index]),
          backgroundColor: categoryColors[Object.keys(categoryColors)[index]],
          borderColor: 'black',
          borderWidth: 1,
          barPercentage: 0.7,
          categoryPercentage: 0.5,
        })),
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [data, chartType]);

  return <canvas ref={chartRef} />;
};

export default CustomChart;
