import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  const lastUpdated = new Date().toLocaleString();

  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        py: 2,
        bgcolor: 'primary.main',
        color: 'white',
      }}
    >
      <Typography variant="body2">Last Updated: {lastUpdated}</Typography>
    </Box>
  );
};

export default Footer;
