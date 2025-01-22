import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Link,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setSelectedCrypto } from '@/store/slices/cryptoSlice';
import { cryptoCurrencies } from '@/utils/constants';

const Header: React.FC = () => {
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
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {/* Crypto Dashboard */}
          Crypto Liveboard
        </Typography>
        <Select
          value={selectedCrypto} // Use value instead of defaultValue
          onChange={handleSelectChange}
          sx={{ width: 200, padding: 1, fontSize: '16px' }}
        >
          {cryptoCurrencies.map((crypto) => (
            <MenuItem key={crypto.id} value={crypto.id}>
              {crypto.name}
            </MenuItem>
          ))}
        </Select>
        <nav style={{ marginLeft: '1rem' }}>
          <Link
            component={NavLink}
            to="/dashboard"
            color="inherit"
            style={{ margin: '0 1rem' }}
          >
            Dashboard
          </Link>
          <Link
            component={NavLink}
            to="/overview"
            color="inherit"
            style={{ margin: '0 1rem' }}
          >
            Overview
          </Link>
          <Link
            component={NavLink}
            to="/history"
            color="inherit"
            style={{ margin: '0 1rem' }}
          >
            History
          </Link>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
