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

const Header: React.FC = () => {
  const [crypto, setCrypto] = React.useState('bitcoin');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCrypto(event.target.value as string);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Crypto Dashboard
        </Typography>
        <Select value={crypto} onChange={handleChange}>
          <MenuItem value="bitcoin">Bitcoin</MenuItem>
          <MenuItem value="ethereum">Ethereum</MenuItem>
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
