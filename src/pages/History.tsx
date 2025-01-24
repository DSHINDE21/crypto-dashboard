import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import {
  TextField,
  CircularProgress,
  Box,
  Typography,
  Select,
  MenuItem,
  Avatar,
} from '@mui/material';
import DataTable from '@/components/dataTable';
import { fetchCryptoData } from '@/services';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatHistoricalDate, formatHistoricalTime } from '@/utils/formatDate';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

interface CryptoData {
  date: string;
  price: string;
  time: string;
  trend: number[];
}

interface HistoryResponse {
  historicalData: number[];
  description: string;
  iconUrl: string;
}

const History: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('7');
  const selectedCrypto = useSelector(
    (state: RootState) => state.crypto.selectedCrypto,
  );

  const { data, isLoading, isError, error } = useQuery<HistoryResponse>({
    queryKey: ['cryptoHistory', selectedCrypto, dateRange],
    queryFn: () => fetchCryptoData(selectedCrypto, parseInt(dateRange)),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error">Error: {(error as Error).message}</Typography>
    );
  }

  const historicalData: CryptoData[] =
    data?.historicalData?.map((price: number, index: number) => ({
      date: formatHistoricalDate(data.historicalData.length - 1 - index),
      price: formatCurrency(price),
      time: formatHistoricalTime(index),
      trend: data.historicalData.slice(Math.max(0, index - 5), index + 1), // Last 5 points for the graph
    })) || [];

  const filteredData = historicalData.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      item.date.toLowerCase().includes(lowerCaseQuery) ||
      item.price.includes(lowerCaseQuery)
    );
  });

  const columns: ColumnDef<CryptoData, any>[] = [
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'price', header: 'Price (USD)' },
    { accessorKey: 'time', header: 'Time' },
    {
      header: 'Trend',
      cell: ({ row }) => {
        const trendData = row.original.trend;
        const chartData = {
          labels: trendData.map((_, idx) => idx.toString()),
          datasets: [
            {
              label: 'Price Trend',
              data: trendData,
              borderColor: '#4caf50',
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        };

        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: { display: false },
            y: { display: false },
          },
        };
        return (
          <Box sx={{ height: 50, width: 150 }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        );
      },
    },
  ];

  const handleDateRangeChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setDateRange(event.target.value as string);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={`${selectedCrypto} logo`}
            src={data?.iconUrl}
            sx={{ width: 40, height: 40, marginRight: 1 }}
          />
          {selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)}
        </Box>
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
          mx: 1,
        }}
      >
        <TextField
          label="Search by Date or Price"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, marginRight: 2 }}
        />
        <Select
          value={dateRange}
          onChange={handleDateRangeChange}
          variant="outlined"
        >
          <MenuItem value="7">Last 7 Days</MenuItem>
          <MenuItem value="30">Last 30 Days</MenuItem>
          <MenuItem value="60">Last 60 Days</MenuItem>
          <MenuItem value="90">Last 90 Days</MenuItem>
          <MenuItem value="365">Last 1 Year</MenuItem>
        </Select>
      </Box>

      <DataTable data={filteredData} columns={columns} isLoading={isLoading} />
    </div>
  );
};

export default History;
