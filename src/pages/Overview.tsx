import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '@store/index';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid2 as Grid,
  Skeleton,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
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
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Overview: React.FC = () => {
  const selectedCrypto = useSelector(
    (state: RootState) => state.crypto.selectedCrypto,
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cryptoData', selectedCrypto],
    queryFn: () => fetchCryptoData(selectedCrypto),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

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
    description,
    iconUrl,
    marketCap,
    currencyRank,
    circulatingSupply,
    athDate,
    athPrice,
    maxSupply,
  } = data;

  const cardData = [
    {
      label: 'Market Cap',
      value: formatCurrency(marketCap),
      color: 'primary',
    },
    {
      label: 'Total Supply',
      value: formatCurrency(maxSupply),
      // color: circulatingSupply > 0 ? 'green' : 'red',
      color: 'primary',
    },
    {
      label: 'Circulating Supply',
      value: formatCurrency(circulatingSupply),
      color: 'primary',
    },
    {
      label: 'All-time High price',
      value: formatCurrency(athPrice),
      color: 'primary',
    },
    {
      label: 'All-time High Date',
      value: formatDate(athDate),
      color: 'primary',
    },
    {
      label: 'Rank',
      value: currencyRank,
      color: 'primary',
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      {/* currencyName and Icon component */}
      <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={`${selectedCrypto} logo`}
            src={iconUrl}
            sx={{ width: 40, height: 40, marginRight: 1 }}
          />
          {selectedCrypto.charAt(0).toUpperCase() + selectedCrypto.slice(1)}
        </Box>
      </Typography>

      {/* Cards component */}
      <Grid container spacing={3}>
        {cardData.map((item, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="h5" color={item.color}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* TODO: Add Categories in 2nd Accordian */}
      {/* Description component */}
      <Accordion defaultExpanded sx={{ marginBottom: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Overview;
