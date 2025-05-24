import { Box, Typography, Paper, Grid } from '@mui/material';
import { useGetTopCryptosQuery } from '../store/api/cryptoApi';

const Portfolio = () => {
  const { data: topCryptos, isLoading } = useGetTopCryptosQuery(5);

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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Your Portfolio
      </Typography>

      <Grid container spacing={3}>
        {topCryptos?.map((crypto) => (
          <Grid item xs={12} md={6} key={crypto.id}>
            <Paper
              sx={{
                p: 3,
                '&:hover': {
                  boxShadow: 3,
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  style={{ width: 32, height: 32 }}
                />
                <Box>
                  <Typography variant="h6">{crypto.name}</Typography>
                  <Typography color="text.secondary">
                    {crypto.symbol.toUpperCase()}
                  </Typography>
                </Box>
                <Box ml="auto">
                  <Typography variant="h6">
                    ${crypto.current_price.toLocaleString()}
                  </Typography>
                  <Typography
                    color={
                      crypto.price_change_percentage_24h > 0
                        ? 'success.main'
                        : 'error.main'
                    }
                  >
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Portfolio;
