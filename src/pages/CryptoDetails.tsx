import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useGetCryptoDetailsQuery } from '../store/api/cryptoApi';

const CryptoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: cryptoDetails, isLoading } = useGetCryptoDetailsQuery(id || '');

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!cryptoDetails) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography>Cryptocurrency not found</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <img
              src={cryptoDetails.image}
              alt={cryptoDetails.name}
              style={{ width: 40, height: 40 }}
            />
            <Typography variant="h4">
              {cryptoDetails.name} ({cryptoDetails.symbol.toUpperCase()})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Market Data
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography>
                Price: $
                {cryptoDetails.market_data.current_price.usd.toLocaleString()}
              </Typography>
              <Typography>
                Market Cap: $
                {cryptoDetails.market_data.market_cap.usd.toLocaleString()}
              </Typography>
              <Typography>
                24h Volume: $
                {cryptoDetails.market_data.total_volume.usd.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography>{cryptoDetails.description}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CryptoDetails;
