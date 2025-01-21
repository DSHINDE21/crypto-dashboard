import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { ChartData } from 'chart.js/auto'; // Type for chart data

// Register required components with Chart.js
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

type LineChartProps = {
  data: ChartData<'line'>; // Define type for Line chart data
  options?: ChartOptions<'line'>; // Define type for Line chart options
};

const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  return <Line data={data} options={options} />;
};

export default LineChart;
