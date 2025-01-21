import React, { useState } from 'react';
import LineChart from '@/components/charts/LineChart';

const Dashboard: React.FC = () => {
  const [chartData, setChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Cryptocurrency Price',
        data: [30000, 31000, 32000, 33000, 34000, 35000, 36000],
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        tension: 0.3, // Smooth curve
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <LineChart data={chartData} options={chartOptions} />
    </div>
  );
};

export default Dashboard;
