import React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '../store';
// import { fetchCryptoData } from '../utils/fetchData';
import { Line } from 'react-chartjs-2';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchCryptoData } from '@/services';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard: React.FC = () => {
  const selectedCrypto = useSelector(
    (state: RootState) => state.crypto.selectedCrypto,
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cryptoData', selectedCrypto],
    queryFn: () => fetchCryptoData(selectedCrypto),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  // Loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  const { currentPrice, percentageChange24h, historicalData } = data!;

  // Chart data
  const chartData = {
    labels: Array(historicalData.length).fill(''), // Blank labels
    datasets: [
      {
        label: 'Price (USD)',
        data: historicalData,
        borderColor: 'rgba(75,192,192,1)', // Line color
        backgroundColor: 'rgba(75,192,192,0.2)', // Area under the line
        tension: 0.4, // Smooth curve
      },
    ],
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header and Cryptocurrency Info */}
      <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        {selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)}
      </Typography>

      <Grid container spacing={3}>
        {/* Current Price Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Current Price</Typography>
              <Typography variant="h5" color="primary">
                ${currentPrice.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 24hr Change Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">24hr Change</Typography>
              <Typography
                variant="h5"
                color={percentageChange24h > 0 ? 'green' : 'red'}
              >
                {percentageChange24h.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Price History (7 Days)</Typography>
              <Box sx={{ marginTop: 2 }}>{/* <Line data={chartData} /> */}</Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
