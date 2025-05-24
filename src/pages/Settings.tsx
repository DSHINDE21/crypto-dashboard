import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleTheme } from '../store/slices/themeSlice';
import { updateNotificationPreferences } from '../store/slices/userSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const notifications = useSelector(
    (state: RootState) => state.user.preferences.notifications,
  );

  const handleThemeChange = () => {
    dispatch(toggleTheme());
  };

  const handleNotificationChange =
    (type: 'priceAlerts' | 'newsUpdates') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateNotificationPreferences({
          type,
          enabled: event.target.checked,
        }),
      );
    };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={theme === 'dark'}
                  onChange={handleThemeChange}
                />
              }
              label="Dark Mode"
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.priceAlerts}
                    onChange={handleNotificationChange('priceAlerts')}
                  />
                }
                label="Price Alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.newsUpdates}
                    onChange={handleNotificationChange('newsUpdates')}
                  />
                }
                label="News Updates"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
