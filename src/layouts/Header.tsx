import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Link,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
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
  const selectedCrypto = useSelector(
    (state: RootState) => state.crypto.selectedCrypto,
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setSelectedCrypto(event.target.value as string));
  };

  const drawer = (
    <Box
      sx={{
        width: 200,
        bgcolor: 'primary.main',
        color: 'white',
        height: '100%',
      }}
    >
      <IconButton
        onClick={handleDrawerToggle}
        sx={{ color: 'white', justifyContent: 'flex-end', p: 2 }}
      >
        <CloseIcon />
      </IconButton>
      <Divider sx={{ bgcolor: 'white' }} />
      <List>
        {navMenuItems.map((item) => (
          <ListItem
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: 'white',
              textDecoration: 'none',
              cursor: 'pointer',
              '&.active': {
                fontWeight: 700,
                textDecoration: 'underline',
                textDecorationThickness: '2px',
                textUnderlineOffset: '4px',
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="primary" sx={{ zIndex: 1300 }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            cursor: 'pointer',
          }}
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

        <Box
          component="nav"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            marginLeft: '1rem',
          }}
        >
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
                },
              }}
            >
              {link.label}
            </Link>
          ))}
        </Box>

        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: 'primary.main',
            color: 'white',
          },
          width: 200,
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
