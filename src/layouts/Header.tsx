import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Link,
  Box,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setSelectedCrypto } from '@/store/slices/cryptoSlice';
import { cryptoCurrencies } from '@/utils/constants';

const navMenuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Overview', path: '/overview' },
  { label: 'History', path: '/history' },
];
const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Access the selectedCrypto value from Redux store
  const selectedCrypto = useSelector(
    (state: RootState) => state.crypto.selectedCrypto,
  );

  // Handle the change in dropdown
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setSelectedCrypto(event.target.value as string));
  };

  return (
    <AppBar position="sticky" color="primary" sx={{ zIndex: 1300 }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 600, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}
        >
          Crypto Dashboard
        </Typography>
        <Select
          value={selectedCrypto}
          onChange={handleSelectChange}
          sx={{
            width: 200,
            padding: 1,
            fontSize: '16px',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiSelect-icon': {
              color: '#fff',
            },
          }}
        >
          {cryptoCurrencies.map((crypto) => (
            <MenuItem key={crypto.id} value={crypto.id}>
              {crypto.name}
            </MenuItem>
          ))}
        </Select>
        <Box component="nav" sx={{ marginLeft: '1rem', display: 'flex' }}>
          {navMenuItems.map((link) => (
            <Link
              key={link.path}
              component={NavLink}
              to={link.path}
              color="inherit"
              sx={{
                margin: '0 1rem',
                textDecoration: 'none',
                fontWeight: 500,
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  fontWeight: 700,
                },
                '&.active': {
                  fontWeight: 700,
                  textDecoration: 'underline',
                  textDecorationThickness: '2px',
                  textUnderlineOffset: '4px',
                  // color: '#ff5722', // Active color
                },
              }}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
