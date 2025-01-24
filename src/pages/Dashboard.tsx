import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '@store/index';
import { Line } from 'react-chartjs-2';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  MenuItem,
  Select,
  Skeleton,
  Avatar,
} from '@mui/material';
import dayjs from 'dayjs';
import { fetchCryptoData } from '@/services';

// Import and register necessary components from Chart.js
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

  const [dateRange, setDateRange] = useState<string>('7');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cryptoData', selectedCrypto, dateRange],
    queryFn: () => fetchCryptoData(selectedCrypto, parseInt(dateRange)),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const handleDateRangeChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setDateRange(event.target.value as string);
  };

  if (isLoading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
          Loading{' '}
          {selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)}...
        </Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error">Error: {(error as Error).message}</Typography>
    );
  }

  if (!data) {
    return <Typography>No details found for {selectedCrypto}</Typography>;
  }

  const {
    currentPrice,
    percentageChange24h,
    tradingVolume,
    historicalData,
    iconUrl,
  } = data;

  const chartLabels = historicalData.map((_: unknown, index: number) =>
    dayjs()
      .subtract(historicalData.length - 1 - index, 'day')
      .format('MMM DD'),
  );

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Price (USD)',
        data: historicalData,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable the default aspect ratio
    aspectRatio: 2, // Aspect ratio = width / height, adjust as needed
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `$${context?.raw?.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Date', font: { weight: 'bold' } },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: 'Price (USD)', font: { weight: 'bold' } },
        grid: { color: 'rgba(200, 200, 200, 0.2)' },
      },
    },
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* currencyName and Icon component */}
      <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={`${selectedCrypto} logo`}
            src={iconUrl}
            sx={{ width: 30, height: 30, marginRight: 1 }}
          />
          {selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)}
        </Box>
      </Typography>

      {/* Cards component */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Current Price</Typography>
              <Typography variant="h5" color="primary">
                ${currentPrice.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
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

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Trading Volume (24h)</Typography>
              <Typography variant="h5" color="textSecondary">
                ${tradingVolume.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart component */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Price History</Typography>
            <Box sx={{ marginTop: 2 }}>
              <Select
                value={dateRange}
                onChange={handleDateRangeChange}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="7">Last 7 Days</MenuItem>
                <MenuItem value="30">Last 30 Days</MenuItem>
                <MenuItem value="60">Last 60 Days</MenuItem>
                <MenuItem value="90">Last 90 Days</MenuItem>
                <MenuItem value="365">Last 1 Year</MenuItem>
              </Select>

              <Box sx={{ height: 300 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
};

export default Dashboard;
