import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

const LoadingFallback: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="background.default"
      color="text.primary"
    >
      <CircularProgress size={80} thickness={4} />
      <Typography variant="h6" mt={2}>
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default LoadingFallback;
