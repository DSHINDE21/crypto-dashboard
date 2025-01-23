import React from 'react';
import { Box } from '@mui/material';
const Header = React.lazy(() => import('@/layouts/Header'));
const Footer = React.lazy(() => import('@/layouts/Footer'));

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box display={'flex'} flexDirection={'column'} minHeight={'100vh'}>
    <Box component="header">
      <Header />
    </Box>
    <Box component="main" flex={1} p={2} bgcolor="background.default">
      {children}
    </Box>
    <Box component="footer">
      <Footer />
    </Box>
  </Box>
);

export default Layout;
