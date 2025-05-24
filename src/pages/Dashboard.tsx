import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '../store';
import { Line } from 'react-chartjs-2';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Avatar,
  SelectChangeEvent,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { fetchCryptoData } from '../services/api';
import { useCryptoData } from '../hooks/useCryptoData';
import { useGetTopCryptosQuery } from '../store/api/cryptoApi';
import { setSelectedCrypto, toggleFavorite } from '../store/slices/cryptoSlice';

// Import and register necessary components from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const selectedCrypto = useSelector(
    (state: RootState) => state.crypto.selectedCrypto,
  );
  const favorites = useSelector((state: RootState) => state.crypto.favorites);
  const [dateRange, setDateRange] = useState<string>('7');

  const {
    data: realTimeData,
    isLoading: isRealTimeLoading,
    error: realTimeError,
  } = useCryptoData();
  const {
    data: topCryptos,
    isLoading: isTopCryptosLoading,
    error: topCryptosError,
  } = useGetTopCryptosQuery(10);

  const {
    data: chartData,
    isLoading: isChartLoading,
    error: chartError,
  } = useQuery({
    queryKey: ['cryptoData', selectedCrypto, dateRange],
    queryFn: () => fetchCryptoData(selectedCrypto, parseInt(dateRange)),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const handleCryptoChange = (event: SelectChangeEvent<string>) => {
    dispatch(setSelectedCrypto(event.target.value));
  };

  const handleDateRangeChange = (event: SelectChangeEvent<string>) => {
    setDateRange(event.target.value);
  };

  const handleToggleFavorite = (cryptoId: string) => {
    dispatch(toggleFavorite(cryptoId));
  };

  const renderError = (error: Error | unknown, type: string) => (
    <Alert severity="error" sx={{ mb: 2 }}>
      Error loading {type}:{' '}
      {error instanceof Error ? error.message : 'Unknown error occurred'}
    </Alert>
  );

  if (isRealTimeLoading || isTopCryptosLoading || isChartLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Price History' },
    },
    scales: {
      x: {
        type: 'category',
        title: { display: true, text: 'Date' },
        grid: { display: false },
      },
      y: {
        type: 'linear',
        title: { display: true, text: 'Price (USD)' },
        grid: { color: 'rgba(200, 200, 200, 0.2)' },
        ticks: {
          callback: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Crypto Dashboard
      </Typography>

      {realTimeError && renderError(realTimeError, 'real-time data')}
      {topCryptosError && renderError(topCryptosError, 'top cryptocurrencies')}
      {chartError && renderError(chartError, 'chart data')}

      {/* Real-time price cards */}
      <Grid container spacing={3} mb={4}>
        {realTimeData?.map((crypto) => (
          <Grid item xs={12} sm={6} md={4} key={crypto.symbol}>
            <Card sx={{ '&:hover': { boxShadow: 3 } }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">{crypto.symbol}</Typography>
                  <Tooltip
                    title={
                      favorites.includes(crypto.symbol)
                        ? 'Remove from favorites'
                        : 'Add to favorites'
                    }
                  >
                    <IconButton
                      onClick={() => handleToggleFavorite(crypto.symbol)}
                    >
                      {favorites.includes(crypto.symbol) ? (
                        <Star color="primary" />
                      ) : (
                        <StarBorder />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography>
                  Price: ${Number(crypto.price).toLocaleString()}
                </Typography>
                <Typography
                  color={
                    Number(crypto.change24h) >= 0
                      ? 'success.main'
                      : 'error.main'
                  }
                >
                  24h Change: {crypto.change24h}%
                </Typography>
                <Typography>
                  Volume: ${Number(crypto.volume).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Crypto selector and chart */}
      <Card>
        <CardContent>
          <Box mb={3} display="flex" gap={2}>
            <Select
              value={selectedCrypto}
              onChange={handleCryptoChange}
              sx={{ minWidth: 200 }}
            >
              {topCryptos?.map((crypto) => (
                <MenuItem key={crypto.id} value={crypto.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={crypto.image} sx={{ width: 24, height: 24 }} />
                    {crypto.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>

            <Select
              value={dateRange}
              onChange={handleDateRangeChange}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="1">24 Hours</MenuItem>
              <MenuItem value="7">7 Days</MenuItem>
              <MenuItem value="30">30 Days</MenuItem>
              <MenuItem value="90">90 Days</MenuItem>
              <MenuItem value="365">1 Year</MenuItem>
            </Select>
          </Box>

          <Box height={400}>
            {chartData && (
              <Line
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      label: `${selectedCrypto.toUpperCase()} Price`,
                      data: chartData.prices,
                      borderColor: 'rgb(75, 192, 192)',
                      backgroundColor: 'rgba(75, 192, 192, 0.1)',
                      tension: 0.1,
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
